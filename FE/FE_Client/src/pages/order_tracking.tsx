import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface OrderTracking {
  id: string;
  status: string;
  shippingStatus: Array<{
    status: string;
    date: string;
    time: string;
  }>;
  items: Array<{
    name: string;
    publisher: string;
    quantity: number;
    image: string;
  }>;
}

const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderTracking | null>(null);

  const mockOrders: OrderTracking[] = [
    {
      id: '714903082',
      status: 'Giao hàng thành công',
      shippingStatus: [
        { status: 'Giao hàng thành công', date: '09:56, Thứ năm', time: '17-11-2022' },
        { status: 'Đang vận chuyển', date: '15:49, Thứ tư', time: '16-11-2022' },
        { status: 'Đang vận chuyển', date: '15:39, Thứ tư', time: '16-11-2022' },
        { status: 'Đang vận chuyển', date: '15:36, Thứ tư', time: '16-11-2022' },
        { status: 'Đang vận chuyển', date: '14:51, Thứ tư', time: '16-11-2022' },
        { status: 'Đang vận chuyển', date: '14:39, Thứ tư', time: '16-11-2022' },
        { status: 'Đang vận chuyển', date: '14:36, Thứ tư', time: '16-11-2022' },
      ],
      items: [
        {
          name: 'Neji - Giấc Tỉnh Thức Nhất Căn Bản Thể Chư Phật (Tập 1) (Kèm CD)',
          publisher: 'Bán và giao bởi Nhà sách Fahasa',
          quantity: 1,
          image: 'https://product.hstatic.net/1000075554/product/-nhat-can-ban-theo-chu-de-vol-1-43s9j_a2aa596ff9304a6ab950bcfadfb01460_f5e7712c6b26437c97d8c3415d425d65.jpg',
        },
      ],
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

    .tracking-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

    .header .view-details {
      padding: 8px 16px;
      background-color: #ffcb00;
      color: #333;
      border: none;
      border-radius: 5px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .header .view-details:hover {
      background-color: #e6b800;
    }

    .tracking-content {
      display: flex;
      justify-content: space-between;
    }

    .tracking-timeline {
      flex: 0 0 60%;
      margin-right: 20px;
    }

    .tracking-timeline h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }

    .tracking-timeline .ship-by {
      font-size: 12px; /* In nhỏ chữ "Được giao bởi Nhà sách Fahasa" */
      color: #6c757d;
      margin-bottom: 20px;
    }

    .tracking-timeline .status {
      display: flex;
      align-items: flex-start;
      position: relative;
      padding-left: 30px;
      margin-bottom: 20px;
    }

    .tracking-timeline .status::before {
      content: '';
      position: absolute;
      left: 10px;
      top: 0;
      bottom: -20px;
      width: 2px;
      background-color: #e9ecef;
    }

    .tracking-timeline .status:last-child::before {
      display: none;
    }

    .tracking-timeline .status .dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: #e9ecef;
      position: absolute;
      left: 6px;
      top: 4px;
    }

    .tracking-timeline .status.delivered .dot {
      background-color: #28a745;
    }

    .tracking-timeline .status .details {
      flex: 1;
    }

    .tracking-timeline .status .details .status-text {
      font-size: 14px;
      font-weight: 500;
      color: #333;
    }

    .tracking-timeline .status.delivered .details .status-text {
      color: #28a745; /* Chữ xanh lá khi giao hàng thành công */
    }

    .tracking-timeline .status .details .time {
      font-size: 12px;
      color: #6c757d;
    }

    .tracking-items {
      flex: 1;
      background-color: #f9fafc;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .tracking-items h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
      background-color: #e9ecef; /* Thêm background nhỏ cho Kiện hàng */
      padding: 5px 10px;
      border-radius: 5px;
      display: inline-block;
    }

    .tracking-items .item {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
    }

    .tracking-items .item img {
      width: 40px;
      height: 40px;
      border-radius: 5px;
    }

    .tracking-items .item .details {
      flex: 1;
    }

    .tracking-items .item .details .name {
      font-size: 14px;
      font-weight: 500;
      color: #333;
      margin-bottom: 4px;
    }

    .tracking-items .item .details .publisher {
      font-size: 12px;
      color: #6c757d;
    }

    .tracking-items .item .quantity {
      font-size: 12px;
      color: #6c757d;
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="tracking-container">
        <div className="header">
          <h1>Theo dõi đơn hàng #{order.id}</h1>
          <button className="view-details">Xem chi tiết đơn hàng</button>
        </div>

        <div className="tracking-content">
          <div className="tracking-timeline">
            <h3>Giao hàng thành công</h3>
            <div className="ship-by">Được giao bởi Nhà sách Fahasa</div>
            {order.shippingStatus.map((status, index) => (
              <div key={index} className={`status ${status.status === 'Giao hàng thành công' ? 'delivered' : ''}`}>
                <div className="dot"></div>
                <div className="details">
                  <div className="status-text">{status.status}</div>
                  <div className="time">{status.date} {status.time}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="tracking-items">
            <h3>Kiện hàng gồm</h3>
            {order.items.map((item, index) => (
              <div key={index} className="item">
                <img src={item.image} alt={item.name} />
                <div className="details">
                  <div className="name">{item.name}</div>
                  <div className="publisher">{item.publisher}</div>
                </div>
                <div className="quantity">x{item.quantity}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderTracking;