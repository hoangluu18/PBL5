import React, { useState } from 'react';
import { FaTrash, FaKey, FaEdit } from 'react-icons/fa';
import OrderTable from '../components/OrderTable';

const UserProfile = () => {
  const [selectedTab, setSelectedTab] = useState('Đơn hàng');
  const [currentPage, setCurrentPage] = useState(1);

  const user = {
    name: 'Anselo Lazinatov',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dXNlcnxlbnwwfHwwfHx8MA%3D%3D',
    totalSpent: 894,
    lastOrder: '1 tuần trước',
    totalOrders: 97,
    address: 'Vancouver, British Columbia, Canada',
    email: 'shatnion@jeemail.com',
    phone: '+1 234 567 890',
  };

  const orders = [
    { id: '#2453', status: 'Đã giao', paymentMethod: 'Thẻ tín dụng', date: '12 Th12, 15:56 CH', total: 87 },
    { id: '#2452', status: 'Sẵn sàng để lấy', paymentMethod: 'Ví MoMo', date: '9 Th12, 12:28 CH', total: 7264 },
    { id: '#2451', status: 'Đã hoàn thành một phần', paymentMethod: 'Tiền mặt khi nhận hàng', date: '4 Th12, 12:56 CH', total: 375 },
    { id: '#2450', status: 'Đã hủy', paymentMethod: 'Thẻ tín dụng', date: '1 Th12, 14:07 SA', total: 657 },
    { id: '#2449', status: 'Đã hoàn thành', paymentMethod: 'Ví MoMo', date: '28 Th11, 17:28 CH', total: 9562 },
    { id: '#2448', status: 'Chưa hoàn thành', paymentMethod: 'Tiền mặt khi nhận hàng', date: '24 Th11, 10:16 SA', total: 256 },
  ];

  const itemsPerPage = 6;
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const styles = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    .user-profile-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f9fafc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 14px;
      color: #007bff;
    }

    .header h1 {
      font-size: 24px;
      color: #333;
    }

    .action-buttons {
      display: flex;
      gap: 10px;
    }

    .action-buttons button {
      padding: 8px 16px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
      color: white;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: background-color 0.3s ease;
      font-size: 14px;
    }

    .delete-button {
      background-color: #dc3545;
    }

    .delete-button:hover {
      background-color: #c82333;
    }

    .reset-password-button {
      background-color: #6c757d;
    }

    .reset-password-button:hover {
      background-color: #5a6268;
    }

    .main-profile {
      display: flex;
      gap: 20px;
      margin-bottom: 20px;
    }

    .left-side {
      flex: 2;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }

    .avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 2px solid #e9ecef;
      margin: 0 auto 10px;
    }

    .user-name {
      font-size: 24px;
      color: #333;
      margin-bottom: 5px;
    }

    .joined-info {
      color: #6c757d;
      font-size: 14px;
      margin-bottom: 15px;
    }

    .social-icons {
      display: inline-flex;
      gap: 5px;
      color: #6c757d;
      font-size: 14px;
    }

    .stats {
      display: flex;
      justify-content: space-around;
      padding: 15px 0;
      border-top: 1px solid #e9ecef;
      border-bottom: 1px solid #e9ecef;
      margin-bottom: 15px;
      color: #6c757d;
      font-size: 14px;
    }

    .stats div {
      text-align: center;
    }

    .stats strong {
      display: block;
      color: #333;
      font-weight: 600;
    }

    .tabs {
      display: flex;
      justify-content: center;
      gap: 10px;
    }

    .tabs button {
      padding: 8px 16px;
      border: none;
      cursor: pointer;
      border-radius: 20px;
      background: none;
      color: #6c757d;
      font-size: 14px;
      transition: background-color 0.3s ease;
    }

    .tabs button.active {
      background-color: #007bff;
      color: white;
    }

    .tabs button:hover {
      background-color: #e9ecef;
    }

    .right-side {
      flex: 1;
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .default-address {
      padding: 0;
      border: none;
      background: transparent;
    }

    .default-address h3 {
      font-size: 16px;
      color: #333;
      margin-bottom: 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .default-address h3 a {
      color: #6c757d;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 5px;
      text-decoration: none;
    }

    .default-address h3 a:hover {
      color: #007bff;
    }

    .address-details div {
      margin-bottom: 20px;
    }

    .address-details h4 {
      font-size: 14px;
      color: #333;
      font-weight: 600;
      margin-bottom: 5px;
    }

    .address-details p {
      color: #6c757d;
      font-size: 14px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .main-profile {
        flex-direction: column;
      }

      .left-side, .right-side {
        width: 100%;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="user-profile-container">
        <div className="header">
          <span>Trang {currentPage} {'>'} Trang {totalPages} {'>'} Mặc định</span>
          <div className="action-buttons">
            <button className="delete-button"><FaTrash /> Xóa tài khoản</button>
            <button className="reset-password-button"><FaKey /> Đặt lại mật khẩu</button>
          </div>
        </div>

        <div className="main-profile">
          <div className="left-side">
            <img src={user.avatar} alt="Ảnh đại diện người dùng" className="avatar" />
            <h2 className="user-name">{user.name}</h2>
            <div className="stats">
              <div>
                <strong>Tổng chi tiêu:</strong> {user.totalSpent}đ
              </div>
              <div>
                <strong>Đơn hàng gần nhất:</strong> {user.lastOrder}
              </div>
              <div>
                <strong>Tổng đơn hàng:</strong> {user.totalOrders}
              </div>
            </div>
            <div className="tabs">
              <button className={selectedTab === 'Đơn hàng' ? 'active' : ''} onClick={() => setSelectedTab('Đơn hàng')}>
                📦 Đơn hàng ({orders.length})
              </button>
              <button className={selectedTab === 'Đánh giá' ? 'active' : ''} onClick={() => setSelectedTab('Đánh giá')}>
                ⭐ Đánh giá (24)
              </button>
              <button className={selectedTab === 'Danh sách yêu thích' ? 'active' : ''} onClick={() => setSelectedTab('Danh sách yêu thích')}>
                ❤️ Danh sách yêu thích
              </button>
              <button className={selectedTab === 'Cửa hàng' ? 'active' : ''} onClick={() => setSelectedTab('Cửa hàng')}>
                🏬 Cửa hàng
              </button>
              <button className={selectedTab === 'Thông tin cá nhân' ? 'active' : ''} onClick={() => setSelectedTab('Thông tin cá nhân')}>
                👤 Thông tin cá nhân
              </button>
            </div>
          </div>

          <div className="right-side">
            <div className="default-address">
              <h3>
                Địa chỉ mặc định
                <a href="#" aria-label="Chỉnh sửa địa chỉ">
                  <FaEdit />
                </a>
              </h3>
              <div className="address-details">
                <div>
                  <h4>Địa chỉ</h4>
                  <p>{user.address}</p>
                </div>
                <div>
                  <h4>Email</h4>
                  <p>{user.email}</p>
                </div>
                <div>
                  <h4>Điện thoại</h4>
                  <p>{user.phone}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedTab === 'Đơn hàng' && (
          <OrderTable
            orders={orders}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            itemsPerPage={itemsPerPage}
          />
        )}
      </div>
    </>
  );
};

export default UserProfile;