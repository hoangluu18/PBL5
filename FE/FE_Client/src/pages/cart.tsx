
import React, { useState, useEffect, useMemo, useContext } from 'react';
import { AuthContext } from "../components/context/auth.context";
import { FaTrash, FaHeart } from 'react-icons/fa';

import { Link, useParams } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import CartService from '../services/cart.service';
import ICartItem from '../models/CartItem';
import { useNavigate } from 'react-router-dom';

const CartPage: React.FC = () => {
  const { customer } = useContext(AuthContext);
  const customerId = customer?.id;
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const cartService = new CartService();
  const navigate = useNavigate();

  // Hàm tạo key duy nhất từ productId và attributes
  const getItemKey = (item: ICartItem): string =>
    `${item.productId}-${item.attributes || ''}`.trim();

  useEffect(() => {
    document.title = "Giỏ hàng";
    const fetchCart = async () => {
      if (customerId) {
        try {
          const items = await cartService.getCart(customerId);
          setCartItems(items);
          if (items.length > 0) {
            setSelectedItems([getItemKey(items[items.length - 1])]);
          }
        } catch (error) {
          console.error("Error fetching cart:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchCart(); 
  }, [customerId]);

  const updateQuantity = (productId: number, change: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.productId === productId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleDeleteItem = async (cartItemId: number) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này?");
    if (confirmDelete) {
        try {
            await cartService.deleteCartItem(cartItemId);
            setCartItems(cartItems.filter(item => item.id !== cartItemId));
        } catch (error) {
            console.error("Lỗi khi xóa cart item:", error);
        }
    }
};

  const handleSelectItem = (item: ICartItem) => {
    const key = getItemKey(item);
    setSelectedItems(current =>
      current.includes(key)
        ? current.filter(k => k !== key)
        : [...current, key]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(getItemKey));
    } else {
      setSelectedItems([]);
    }
  };

  const subtotal = useMemo(() =>
    cartItems.reduce((sum, item) => sum + item.lastPrice * item.quantity, 0),
    [cartItems]
  );
  const shippingCost = 0;
  const total = subtotal + shippingCost;

  const selectedSubtotal = useMemo(() =>
    cartItems
      .filter(item => selectedItems.includes(getItemKey(item)))
      .reduce((sum, item) => sum + item.lastPrice * item.quantity, 0),
    [cartItems, selectedItems]
  );
  const selectedTotal = selectedSubtotal + shippingCost;

  if (loading) {
    return <div>Loading...</div>;
  }

  if (cartItems.length === 0) {
    return <div>Giỏ hàng của bạn đang trống. <Link to="/">Tiếp tục mua sắm</Link></div>;
  }

  const formatPrice = (price: number) => `${price.toLocaleString()}đ`;

  const handleCheckout = () => {
    if (!customerId) {
      alert("Vui lòng đăng nhập để tiến hành thanh toán");
      return;
    }
    
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để thanh toán");
      return;
    }
    
    // Lấy ra ID của các cart items đã chọn
    const selectedCartIds = cartItems
      .filter(item => selectedItems.includes(getItemKey(item)))
      .map(item => item.id);
    
    console.log("Các sản phẩm đã chọn để thanh toán:", selectedCartIds);
    
    // Lưu vào localStorage
    localStorage.setItem('selectedCartIds', JSON.stringify(selectedCartIds));
    
    // Chuyển hướng đến trang checkout
    navigate('/checkout');
  };
  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>Giỏ hàng</h2>
        <div className="cart-header">
          <input
            type="checkbox"
            onChange={handleSelectAll}
            checked={selectedItems.length === cartItems.length && cartItems.length > 0}
          />
          <span>Chọn tất cả ({cartItems.length} sản phẩm)</span>
        </div>
        {cartItems.map(item => {
          const key = getItemKey(item);
          return (
            <div key={key} className="cart-item-row">
              <div className="cart-item-checkbox">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(key)}
                  onChange={() => handleSelectItem(item)}
                />
              </div>
              <div className="cart-item-image">
                {item.photo && (
                  <img
                    src={`http://localhost:5173/src/assets/product-images/${item.photo}`}
                    alt={item.productName}
                    className="product-image"
                  />
                )}
              </div>
              <div className="cart-item-details">
                <div className="cart-item-info">
                  <span className="shop-name">{item.shopName}</span>
                  <span className="product-name">{item.productName}</span>
                  <div className="cart-item-attributes">
                    <span>{item.attributes || 'N/A'}</span>
                  </div>
                </div>
                <div className="cart-item-price">
                  <span className="original-price"><del>{formatPrice(item.originalPrice)}</del></span>
                  <span className="discounted-price">{formatPrice(item.lastPrice)}</span>
                </div>
                <div className="cart-item-quantity">
                  <button onClick={() => updateQuantity(item.productId, -1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.productId, 1)}>+</button>
                </div>
                <div className="cart-item-total">
                  {formatPrice(item.lastPrice * item.quantity)}
                </div>
                <div className="cart-item-actions">
                  <FaTrash className="delete-icon" onClick={() => handleDeleteItem(item.productId)} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="summary">
        <OrderSummary
          orderItems={cartItems
            .filter(item => selectedItems.includes(getItemKey(item)))
            .map(item => ({
              id: item.productId,
              image: item.photo
                ? `http://localhost:5173/src/assets/product-images/${item.photo}`
                : 'http://localhost:5173/src/assets/product-images/default-image.jpg',
              shopId: item.shopId,
              shopName: item.shopName,
              name: item.productName,
              quantity: item.quantity,
              originalPrice: item.originalPrice,
              price: item.lastPrice,
            }))
          }
          subtotal={selectedSubtotal}
          shippingCost={shippingCost}
          total={selectedTotal}
        />
        <button
          onClick={handleCheckout}
          className="checkout-button"
        >
          Tiến hành thanh toán {'>'}
        </button>
      </div>
    </div>
  );
};

export default CartPage;

// CSS Styles (giữ nguyên)
const styles = `
.cart-container {
  display: flex;
  gap: 30px;
  padding: 20px;
  background-color: #f9f9f9;
  margin: 20px auto 50px auto;
  max-width: 1500px;
  width: 90%;
  align-items: flex-start;
}

.cart-items {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  align-self: flex-start;
}

.cart-items h2,
.summary h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.cart-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
}

.cart-header input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.cart-header span {
  font-size: 16px;
  color: #333;
}

.cart-item-row {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
}

.cart-item-checkbox {
  width: 30px;
}

.cart-item-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.cart-item-image {
  width: 80px;
  height: 80px;
  margin-right: 15px;
}

.cart-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.cart-item-details {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.cart-item-info {
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.cart-item-info .shop-name {
  color: #ff424e;
  font-size: 14px;
  font-weight: 500;
}

.cart-item-info .product-name {
  font-size: 16px;
  font-weight: 500;
  color: #333;
}

.cart-item-attributes {
  font-size: 14px;
  color: #666;
}

.cart-item-price {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.cart-item-price .original-price {
  font-size: 14px;
  color: #999;
  text-decoration: line-through;
}

.cart-item-price .discounted-price {
  font-size: 16px;
  color: #000; /* Đổi thành màu đen */
  font-weight: 500;
}

.cart-item-quantity {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  justify-content: center;
}

.cart-item-quantity button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  color: #666;
  border-radius: 4px;
}

.cart-item-quantity button:hover {
  background-color: #f0f0f0;
}

.cart-item-quantity span {
  min-width: 30px;
  text-align: center;
  font-size: 16px;
}

.cart-item-quantity .stock-status {
  font-size: 12px;
  color: #666;
  margin-left: 10px;
}

.cart-item-total {
  flex: 1;
  font-size: 16px;
  font-weight: 500;
  color: #000; /* Đổi thành màu đen */
  text-align: center;
}

.cart-item-actions {
  flex: 0.5;
  display: flex;
  gap: 15px;
  justify-content: center;
}

.cart-item-actions .wishlist-icon,
.cart-item-actions .delete-icon {
  cursor: pointer;
  font-size: 16px;
  color: #666;
}

.cart-item-actions .wishlist-icon:hover {
  color: #ff424e;
}

.cart-item-actions .delete-icon:hover {
  color: #dc3545;
}

/* Phần summary giữ nguyên */
.summary {
  width: 380px;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.checkout-button {
  display: block;
  width: 100%;
  padding: 12px;
  background-color: rgb(0, 138, 252);
  color: white;
  text-align: center;
  border-radius: 5px;
  margin-top: 20px;
  text-decoration: none;
  transition: background-color 0.2s;
}

.checkout-button:hover {
  background-color: #0b7dda;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .cart-container {
    flex-direction: column;
  }

  .cart-items {
    width: 100%;
  }

  .cart-item-row {
    flex-direction: column;
    align-items: flex-start;
  }

  .cart-item-image {
    width: 100px;
    height: 100px;
  }

  .cart-item-details {
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  }

  .cart-item-price,
  .cart-item-quantity,
  .cart-item-total,
  .cart-item-actions {
    flex: none;
    width: 100%;
    text-align: left;
    margin-top: 10px;
  }

  .cart-item-price {
    flex-direction: row;
    gap: 10px;
  }

  .cart-item-quantity {
    justify-content: flex-start;
  }

  .cart-item-total {
    text-align: left;
  }

  .cart-item-actions {
    justify-content: flex-start;
  }

  .summary {
    width: 100%;
  }
}
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);