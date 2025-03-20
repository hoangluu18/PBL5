import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaCommentDots, FaEye, FaShoppingCart } from 'react-icons/fa';

interface Order {
  id: string;
  status: string;
  date: string;
  customer: {
    name: string;
    address: string;
    phone: string;
  };
  shipping: {
    method: string;
    estimatedDelivery: string;
    fee: number;
  };
  paymentMethod: string;
  items: Array<{
    name: string;
    publisher: string;
    sku: string;
    price: number;
    quantity: number;
    discount: number;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
}

const OrderDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  const mockOrders: Order[] = [
    {
      id: '714903082',
      status: 'Giao hàng thành công',
      date: '09:32 11/11/2022',
      customer: {
        name: 'Lưu Việt Hoàng',
        address: '15 tẩm 8, Phường Hòa Khánh Nam, Quận Liên Chiểu, Đà Nẵng, Việt Nam',
        phone: '0863190264',
      },
      shipping: {
        method: 'FAST Giao Tiết Kiệm',
        estimatedDelivery: '18/11',
        fee: 44000,
      },
      paymentMethod: 'Thanh toán tiền mặt khi nhận hàng',
      items: [
        {
          name: 'Neji - Giấc Tỉnh Thức Nhất Căn Bản Thể Chư Phật (Tập 1) (Kèm CD)',
          publisher: 'Cung cấp bởi Nhà sách Fahasa',
          sku: '535415351674',
          price: 93900,
          quantity: 1,
          discount: 0,
        },
      ],
      subtotal: 93900,
      shippingFee: 44000,
      total: 137900,
    },
  ];

  useEffect(() => {
    const foundOrder = mockOrders.find((o) => o.id === id);
    setOrder(foundOrder || null);
  }, [id]);

  if (!order) {
    return <div>Đơn hàng không tồn tại</div>;
  }

  const styles = `
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
    }

    .order-detail-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f9fafc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      position: relative; /* Đảm bảo tham chiếu cho các phần tử con */
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .header h1 {
      font-size: 18px;
      font-weight: 600;
      color: #333;
    }

    .header .date {
      font-size: 14px;
      color: #6c757d;
    }

    .info-section {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }

    .info-block {
      flex: 1;
      background-color: white;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-right: 20px;
    }

    .info-block:last-child {
      margin-right: 0;
    }

    .info-block h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    .info-block p {
      font-size: 14px;
      color: #6c757d;
      line-height: 1.5;
    }

    .items-table {
      margin-bottom: 20px;
    }

    .items-table table {
      width: 100%;
      border-collapse: collapse;
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .items-table th, .items-table td {
      padding: 12px 15px;
      text-align: left;
      font-size: 14px;
      border-bottom: 1px solid #e9ecef;
    }

    .items-table th {
      background-color: #f9fafc;
      font-weight: 600;
      color: #333;
    }

    .items-table td {
      color: #6c757d;
    }

    .items-table .product-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .items-table .product-info img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }

    .items-table .product-info .details {
      display: flex;
      flex-direction: column;
    }

    .items-table .product-info .details .name {
      font-weight: 500;
      color: #333;
    }

    .items-table .product-info .details .publisher {
      font-size: 12px;
      color: #6c757d;
    }

    .items-table .product-info .details .sku {
      font-size: 12px;
      color: #6c757d;
    }

    .items-table .actions {
      display: flex;
      gap: 10px;
    }

    .items-table .actions button {
      padding: 6px 12px;
      border: 1px solid #e9ecef;
      border-radius: 5px;
      background: none;
      font-size: 12px;
      color: #6c757d;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 5px;
      transition: background-color 0.3s ease;
    }

    .items-table .actions button:hover {
      background-color: #f1f3f5;
    }

    .summary {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      margin-left: auto; /* Đẩy summary sát mép phải tự động */
      width: auto; /* Tự động điều chỉnh chiều rộng */
    }

    .summary-table {
      width: 300px;
      text-align: right;
      margin-right: 0; /* Đảm bảo không có khoảng cách bên phải */
    }

    .summary-table div {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      font-size: 14px;
      color: #6c757d;
    }

    .summary-table div.total {
      font-weight: 600;
      color: #333;
      border-top: 1px solid #e9ecef;
      padding-top: 10px;
      margin-top: 10px;
    }

    .footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer .back-link {
      font-size: 14px;
      color: #007bff;
      text-decoration: none;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .footer .back-link:hover {
      text-decoration: underline;
    }

    .footer .track-button {
      padding: 10px 20px;
      background-color: #ffcb00;
      color: #333;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .footer .track-button:hover {
      background-color: #e6b800;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="order-detail-container">
        <div className="header">
          <h1>Chi tiết đơn hàng #{order.id} - {order.status}</h1>
          <span className="date">Ngày đặt hàng: {order.date}</span>
        </div>

        <div className="info-section">
          <div className="info-block">
            <h3>Địa chỉ nguồn nhận</h3>
            <p>{order.customer.name}</p>
            <p>Địa chỉ: {order.customer.address}</p>
            <p>Điện thoại: {order.customer.phone}</p>
          </div>
          <div className="info-block">
            <h3>Hình thức giao hàng</h3>
            <p>{order.shipping.method}</p>
            <p>Được giao bởi Nhánh sách Fahasa</p>
            <p>Phí vận chuyển: {order.shipping.fee.toLocaleString()} đ</p>
          </div>
          <div className="info-block">
            <h3>Hình thức thanh toán</h3>
            <p>{order.paymentMethod}</p>
          </div>
        </div>

        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Giảm giá</th>
                <th>Tạm tính</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="product-info">
                      <img src="https://product.hstatic.net/1000075554/product/-nhat-can-ban-theo-chu-de-vol-1-43s9j_a2aa596ff9304a6ab950bcfadfb01460_f5e7712c6b26437c97d8c3415d425d65.jpg" alt={item.name} />
                      <div className="details">
                        <span className="name">{item.name}</span>
                        <span className="publisher">{item.publisher}</span>
                        <span className="sku">SKU: {item.sku}</span>
                      </div>
                    </div>
                  </td>
                  <td>{item.price.toLocaleString()} đ</td>
                  <td>{item.quantity}</td>
                  <td>{item.discount.toLocaleString()} đ</td>
                  <td>{(item.price * item.quantity - item.discount).toLocaleString()} đ</td>
                </tr>
              ))}
              <tr>
                <td colSpan={5} className="actions">
                  <button>
                    <FaCommentDots /> Chat với nhà bán
                  </button>
                  <button>
                    <FaEye /> Viết nhận xét
                  </button>
                  <button>
                    <FaShoppingCart /> Mua lại
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="summary">
          <div className="summary-table">
            <div>
              <span>Tạm tính</span>
              <span>{order.subtotal.toLocaleString()} đ</span>
            </div>
            <div>
              <span>Phí vận chuyển</span>
              <span>{order.shippingFee.toLocaleString()} đ</span>
            </div>
            <div className="total">
              <span>Tổng cộng</span>
              <span>{order.total.toLocaleString()} đ</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <a href="#" className="back-link">
            <span>{'<'}</span> Quay lại đơn hàng của tôi
          </a>
          <button className="track-button">Theo dõi đơn hàng</button>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;