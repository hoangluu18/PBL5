import React, { useMemo } from 'react';
import { FaCheckCircle, FaCircle, FaTimes } from 'react-icons/fa';

interface Order {
  id: string;
  status: string;
  paymentMethod: string;
  date: string;
  total: number;
}

interface OrderTableProps {
  orders: Order[];
  currentPage: number;
  setCurrentPage: (page: number) => void;
  itemsPerPage?: number;
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, currentPage, setCurrentPage, itemsPerPage = 6 }) => {
  const totalPages = Math.ceil(orders.length / itemsPerPage);

  const paginatedOrders = useMemo(() => {
    return orders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  }, [currentPage, orders, itemsPerPage]);

  const getStatusStyle = (status: string) => {
    const iconStyles = 'mr-2';
    let icon, className;

    switch (status) {
      case 'Đã giao':
      case 'Đã hoàn thành':
        icon = <FaCheckCircle className={iconStyles} />;
        className = 'status-completed';
        break;
      case 'Sẵn sàng để lấy':
        icon = <FaCircle className={iconStyles} />;
        className = 'status-ready';
        break;
      case 'Đã hoàn thành một phần':
        icon = <FaCircle className={iconStyles} />;
        className = 'status-partial';
        break;
      case 'Đã hủy':
      case 'Chưa hoàn thành':
        icon = <FaTimes className={iconStyles} />;
        className = 'status-cancelled';
        break;
      default:
        icon = null;
        className = 'status-default';
    }

    return (
      <div className={`status-badge ${className}`}>
        {icon}
        <span>{status}</span>
      </div>
    );
  };

  const getPaymentMethodStyle = (method: string) => {
    const textStyles = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium justify-center w-full';
    let bgColor, textColor;

    switch (method) {
      case 'Thẻ tín dụng':
        bgColor = 'bg-blue-100';
        textColor = 'text-blue-800';
        break;
      case 'Ví MoMo':
        bgColor = 'bg-pink-100';
        textColor = 'text-pink-800';
        break;
      case 'Tiền mặt khi nhận hàng':
        bgColor = 'bg-green-100';
        textColor = 'text-green-800';
        break;
      default:
        bgColor = 'bg-gray-100';
        textColor = 'text-gray-800';
    }

    return (
      <span className={`${textStyles} ${bgColor} ${textColor}`}>
        {method}
      </span>
    );
  };

  const tableStyles = `
    .orders-table {
      margin-top: 20px;
    }

    .orders-table table {
      width: 100%;
      border-collapse: collapse;
      border-spacing: 0;
    }

    .orders-table th, .orders-table td {
      padding: 12px 15px;
      text-align: center;
      background-color: white;
      color: #6c757d;
      font-size: 14px;
      vertical-align: middle;
      border-bottom: 1px solid #e9ecef;
    }

    .orders-table th {
      background-color: #f9fafc;
      font-weight: 600;
      color: #333;
      text-align: center;
      position: sticky;
      top: 0;
      z-index: 1;
    }

    .orders-table th:nth-child(1), .orders-table td:nth-child(1) {
      width: 20%;
    }

    .orders-table th:nth-child(2), .orders-table td:nth-child(2) {
      width: 20%;
    }

    .orders-table th:nth-child(3), .orders-table td:nth-child(3) {
      width: 25%;
    }

    .orders-table th:nth-child(4), .orders-table td:nth-child(4) {
      width: 20%;
    }

    .orders-table th:nth-child(5), .orders-table td:nth-child(5) {
      width: 15%;
    }

    .orders-table tbody tr {
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
      border-radius: 5px;
      transition: background-color 0.2s ease;
    }

    .orders-table tbody tr:hover {
      background-color: #f1f3f5;
    }

    .pagination {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      font-size: 14px;
      color: #6c757d;
    }

    .pagination a {
      color: #007bff;
      text-decoration: none;
      margin-left: 5px;
    }

    .pagination-buttons {
      display: flex;
      gap: 5px;
    }

    .pagination-buttons button {
      padding: 6px 12px;
      border: none;
      background-color: #e9ecef;
      cursor: pointer;
      border-radius: 4px;
      color: #333;
      transition: background-color 0.3s ease;
    }

    .pagination-buttons .active {
      background-color: #007bff;
      color: white;
    }

    .pagination-buttons button:hover {
      background-color: #007bff;
      color: white;
    }

    @media (max-width: 768px) {
      .orders-table th, .orders-table td {
        font-size: 12px;
        padding: 8px;
      }

      .orders-table th:nth-child(1), .orders-table td:nth-child(1) {
        width: 15%;
      }

      .orders-table th:nth-child(2), .orders-table td:nth-child(2) {
        width: 20%;
      }

      .orders-table th:nth-child(3), .orders-table td:nth-child(3) {
        width: 30%;
      }

      .orders-table th:nth-child(4), .orders-table td:nth-child(4) {
        width: 20%;
      }

      .orders-table th:nth-child(5), .orders-table td:nth-child(5) {
        width: 15%;
      }
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }

    .status-completed {
      background-color: #d4edda;
      color: #155724;
    }

    .status-ready {
      background-color: #d1ecf1;
      color: #0c5460;
    }

    .status-partial {
      background-color: #fff3cd;
      color: #856404;
    }

    .status-cancelled {
      background-color: #f8d7da;
      color: #721c24;
    }

    .status-default {
      background-color: #e9ecef;
      color: #6c757d;
    }

    .mr-2 {
      margin-right: 8px;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: tableStyles }} />
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>MÃ ĐƠN HÀNG</th>
              <th>TRẠNG THÁI</th>
              <th>PHƯƠNG THỨC THANH TOÁN</th>
              <th>NGÀY</th>
              <th>TỔNG CỘNG</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{getStatusStyle(order.status)}</td>
                <td>{getPaymentMethodStyle(order.paymentMethod)}</td>
                <td>{order.date}</td>
                <td>{order.total}đ</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <span>
          1 đến {paginatedOrders.length} mục trong {orders.length} <a href="#">Xem tất cả</a>
        </span>
        <div className="pagination-buttons">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>
            {'<'}
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              className={currentPage === i + 1 ? 'active' : ''}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>
            {'>'}
          </button>
        </div>
      </div>
    </>
  );
};

export default OrderTable;