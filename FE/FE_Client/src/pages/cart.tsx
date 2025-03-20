import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary';
import PaymentMethod from '../components/PaymentMethod';

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Fitbit Sense Advanced Smartwatch", color: "Glossy black", size: "XL", price: 199, quantity: 2, image: "https://th.bing.com/th/id/R.fac200b7524ac1d0da7c433b2556ff45?rik=Ubhob0BFIz%2fXCg&pid=ImgRaw&r=0" },
    { id: 2, name: "iPhone 13 Pro Max-Pacific Blue-128GB", color: "Glossy black", size: "XL", price: 150, quantity: 2, image: "https://prium.github.io/phoenix/v1.14.0/assets/img/products/2.png" },
    { id: 3, name: "Apple MacBook Pro 13 inch-M1-8/256GB", color: "Glossy Golden", size: "34mm", price: 65, quantity: 2, image: "https://adminapi.applegadgetsbd.com/storage/media/large/2324-41148.jpg" }
  ]);

  const updateQuantity = (id: number, change: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + change) } : item
      )
    );
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = 59;
  const tax = subtotal * 0.18;
  const shippingCost = 30;
  const total = subtotal - discount + tax + shippingCost;

  return (
    <div className="cart-container container">
      <div className="cart-items">
        <h2>Giỏ hàng</h2>
        <table className="cart-table">
          <thead>
            <tr>
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
                <td className="action"><FaTrash /></td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="subtotal-row">
              <td colSpan={5} style={{ textAlign: "left", fontWeight: "bold" }}>Tổng cộng:</td>
              <td style={{ fontWeight: "bold" }}>{subtotal}đ</td>
              <td></td>
            </tr>
          </tfoot>
        </table>

      </div>

      <div className="summary">
        <OrderSummary
          orderItems={cartItems.map((item, index) => ({
            ...item,
            shopId: index % 2 === 0 ? 1 : 2,  // Chia sản phẩm vào 2 shop luân phiên
            shopName: index % 2 === 0 ? "Shop A" : "Shop B" // Gán tên shop tương ứng
          }))}
          subtotal={subtotal}
          discount={discount}
          tax={tax}
          shippingCost={shippingCost}
          total={total}
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
  background-color: #f9f9f9;
  margin: 20px auto 50px auto;
  align-items: flex-start; /* Đảm bảo các phần tử thẳng hàng theo chiều trên */
}

.cart-items {
  flex: 1;
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  align-self: flex-start; /* Giữ nguyên chiều cao của giỏ hàng */
}

.cart-items {
  flex: 1;
}

.cart-items h2, .summary h2 {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.cart-table th, .cart-table td {
  padding: 12px;
  text-align:center;
}



.cart-table td:first-child {
  text-align: left; /* Riêng cột sản phẩm căn trái */
}

.cart-table th {
  background-color: #f5f5f5;
  font-weight: bold;
}

.cart-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
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

.quantity-control button {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
}

.subtotal-row {
  background-color:rgb(255, 255, 255);
  font-size: 16px;
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
}

.checkout-button:hover {
  background-color: #0b7dda;
}


`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);
