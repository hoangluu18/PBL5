import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import PaymentMethod from '../components/PaymentMethod';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Fitbit Sense Advanced Smartwatch", color: "Đen", size: "XL", price: 199, quantity: 2, image: "https://th.bing.com/th/id/R.fac200b7524ac1d0da7c433b2556ff45?rik=Ubhob0BFIz%2fXCg&pid=ImgRaw&r=0" },
    { id: 2, name: "iPhone 13 Pro Max-Pacific Blue-128GB", color: "Đen", size: "XL", price: 150, quantity: 2, image: "https://prium.github.io/phoenix/v1.14.0/assets/img/products/2.png" },
    { id: 3, name: "Apple MacBook Pro 13 inch-M1-8/256GB", color: "Vàng", size: "34mm", price: 65, quantity: 2, image: "https://adminapi.applegadgetsbd.com/storage/media/large/2324-41148.jpg" }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  
  const handleDeleteItem = (id: number) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
    setSelectedItems(current => current.filter(itemId => itemId !== id));
  };

  const handleSelectItem = (id: number) => {
    setSelectedItems(current => 
      current.includes(id) 
        ? current.filter(itemId => itemId !== id) 
        : [...current, id]
    );
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedItems(cartItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 59;
  const tax = subtotal * 0.18;
  const shippingCost = 30;
  const total = subtotal - discount + tax + shippingCost;
  // Tính toán lại tổng tiền dựa trên các item được chọn
  const selectedSubtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((sum, item) => sum + item.price * item.quantity, 0);
  const selectedTax = selectedSubtotal * 0.18;
  const selectedTotal = selectedSubtotal - discount + selectedTax + shippingCost;


  return (
    <div className="cart-container">
      <div className="cart-items">
        <h2>Giỏ hàng</h2>
        <table className="cart-table">
  <thead>
    <tr>
      <th>
        <input 
          type="checkbox"
          onChange={handleSelectAll}
          checked={selectedItems.length === cartItems.length}
        />
      </th>
      <th>SẢN PHẨM</th>
      <th>MÀU SẮC</th>
      <th>SIZE</th>
      <th>GIÁ TIỀN</th>
      <th>SỐ LƯỢNG</th>
      <th>THÀNH TIỀN</th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    {cartItems.map(item => (
      <tr key={item.id}>
        <td>
          <input 
            type="checkbox"
            checked={selectedItems.includes(item.id)}
            onChange={() => handleSelectItem(item.id)}
          />
        </td>
        <td className="product-info">
          <img src={item.image} alt={item.name} className="product-image" />
          {item.name}
        </td>
        <td>{item.color}</td>
        <td>{item.size}</td>
        <td>{item.price}đ</td>
        <td className="quantity-control">
          <button onClick={() => updateQuantity(item.id, -1)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(item.id, 1)}>+</button>
        </td>
        <td>{item.price * item.quantity}đ</td>
        <td className="action">
          <FaTrash onClick={() => handleDeleteItem(item.id)} />
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>

      <div className="summary">
      <OrderSummary 
  orderItems={cartItems
    .filter(item => selectedItems.includes(item.id))
    .map((item, index) => ({
      ...item, 
      shopId: index % 2 === 0 ? 1 : 2,
      shopName: index % 2 === 0 ? "Shop A" : "Shop B"
    }))} 
  subtotal={selectedSubtotal} 
  discount={discount} 
  tax={selectedTax} 
  shippingCost={shippingCost} 
  total={selectedTotal}  
/>
        <Link to="/checkout" className="checkout-button">Tiến hành thanh toán {'>'}</Link>
      </div>
    </div>
  );
};

export default CartPage;



// CSS Styles
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

  .cart-items h2, .summary h2 {
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .cart-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }

  .cart-table th {
    background-color: #f5f5f5;
    font-weight: bold;
    white-space: nowrap;
    padding: 12px 8px;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
  }

  .cart-table td {
    padding: 12px 8px;
    text-align: center;
    vertical-align: middle;
  }

  /* Column widths */
  .cart-table th:first-child,
  .cart-table td:first-child {
    width: 40px;
  }

  .cart-table th:nth-child(2),
  .cart-table td:nth-child(2) {
    width: 300px;
  }

  .cart-table th:nth-child(3),
  .cart-table td:nth-child(3) {
    width: 100px;
  }

  .cart-table th:nth-child(4),
  .cart-table td:nth-child(4) {
    width: 80px;
  }

  .cart-table th:nth-child(5),
  .cart-table td:nth-child(5) {
    width: 100px;
  }

  .cart-table th:nth-child(6),
  .cart-table td:nth-child(6) {
    width: 120px;
  }

  .cart-table th:nth-child(7),
  .cart-table td:nth-child(7) {
    width: 120px;
  }

  .cart-table th:last-child,
  .cart-table td:last-child {
    width: 50px;
  }

  .cart-table tbody tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  .cart-table td.product-info {
    text-align: left;
  }

  .product-info {
    display: flex;
    align-items: center;
    gap: 10px;
    max-width: 300px;
    word-wrap: break-word;
    white-space: normal;
  }

  .product-image {
    width: 40px;
    height: 40px;
    border-radius: 5px;
    object-fit: cover;
  }

  .quantity-control {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .quantity-control button {
    width: 32px;
    height: 32px;
    border: none;
    background: none;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    color: #666;
  }

  .quantity-control button:hover {
    color: #333;
  }

  .quantity-control span {
    min-width: 30px;
    text-align: center;
  }

  .action {
    width: 50px;
    cursor: pointer;
    color: rgb(164, 164, 164);
    text-align: center;
  }

  .action:hover {
    color: rgb(133, 132, 132);
  }

  .action svg {
    cursor: pointer;
    transition: color 0.2s;
  }
  
  .action svg:hover {
    color: #dc3545;
  }

  .summary {
    width: 380px;
    background-color: white;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .summary-item {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .summary-item.discount {
    color: red;
  }

  .summary-total {
    font-weight: bold;
    border-top: 2px solid #e0e0e0;
    padding-top: 10px;
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
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

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
