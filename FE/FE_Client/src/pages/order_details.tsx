import React, { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { Layout, Skeleton, Row, Col, Card, message, Button, Modal } from 'antd';
import { getOrderDetails } from '../services/order_detail.service';
import { OrderDetailsResponse } from '../models/order_detail/OrderDetailResponse';
import { AuthContext } from "../components/context/auth.context";
import axios from 'axios';
import TextArea from 'antd/es/input/TextArea';

const { Content } = Layout;


const OrderDetail: React.FC = () => {
  const { customer } = useContext(AuthContext);
  const customerId = customer?.id;

  const { id } = useParams<{ id: string }>();

  const [orderDetails, setOrderDetails] = useState<OrderDetailsResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  //hoan tien
  const [isEligibleForRefund, setIsEligibleForRefund] = useState<boolean>(false);
  const [isRefundModalVisible, setIsRefundModalVisible] = useState<boolean>(false);
  const [refundReason, setRefundReason] = useState<string>("");
  const [isRefunding, setIsRefunding] = useState<boolean>(false);


const checkRefundEligibility = async (orderId: number) => {
  try {
    // Lấy token từ localStorage
    const token = localStorage.getItem('access_token');
    
    // Debug logs
    console.log("Token:", token);
    console.log("Request to:", `http://localhost:8081/api/payment/status/${orderId}`);
    
    const response = await axios.get(`http://localhost:8081/api/payment/status/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    console.log('Kết quả kiểm tra escrow:', response.data);

    // Backend chỉ trả về {"escrowStatus":"HOLDING"}
    // Kiểm tra nếu escrowStatus là HOLDING
    if (response.data.escrowStatus === 'HOLDING') {
      setIsEligibleForRefund(true);
    }
  } catch (error) {
    console.error('Lỗi kiểm tra điều kiện hoàn tiền:', error);
    
    // Xử lý lỗi cụ thể hơn
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.error("Lỗi xác thực. Token có thể đã hết hạn hoặc không hợp lệ");
      message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    }
  }
};

const handleRefund = async () => {
  if (!refundReason.trim()) {
    message.error('Vui lòng nhập lý do hoàn tiền');
    return;
  }

  setIsRefunding(true);
  try {
    // Lấy token từ localStorage - chú ý sửa từ 'accessToken' thành 'access_token'
    const token = localStorage.getItem('access_token');
    
    // Debug logs
    console.log("Token hoàn tiền:", token);
    console.log("Request to:", `http://localhost:8081/api/payment/refund/${id}`);
    
    await axios.post(
      `http://localhost:8081/api/payment/refund/${id}`,
      { reason: refundReason },
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );

    message.success('Hoàn tiền thành công!');
    setIsRefundModalVisible(false);
    
    // Tải lại thông tin đơn hàng
    const data = await getOrderDetails(parseInt(id!), customerId);
    setOrderDetails(data);
    setIsEligibleForRefund(false);
  } catch (error) {
    console.error('Lỗi khi xử lý hoàn tiền:', error);
    
    // Xử lý lỗi chi tiết hơn
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      message.error('Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại');
    } else {
      message.error('Có lỗi xảy ra khi hoàn tiền. Vui lòng thử lại sau.');
    }
  } finally {
    setIsRefunding(false);
  }
};

 useEffect(() => {
  const fetchOrderDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      console.log('Đang tải thông tin đơn hàng ID:', id, 'Khách hàng ID:', customerId);
      const data = await getOrderDetails(parseInt(id), customerId);
      setOrderDetails(data);
      
      // Kiểm tra điều kiện hoàn tiền chỉ khi đơn hàng đã giao và thanh toán bằng ví
      if (data.orderDto.orderStatus === 'DELIVERED' && 
          data.orderDto.paymentMethod === 'WALLET') {
        await checkRefundEligibility(parseInt(id));
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrderDetails();
}, [id, customerId]);

  if (loading) {
    return (
      <Layout style={{
        background: 'linear-gradient(0deg, #F5F7FA, #F5F7FA), #FFFFFF',
        minHeight: '100vh',
        width: '100%',
        maxWidth: '1920px',
        margin: '0 auto',
        padding: '20px'
      }}>
        <Content className='container'>
          <div style={{ marginBottom: '20px' }}>
            <Skeleton active paragraph={{ rows: 0 }} />
          </div>

          <Skeleton.Input style={{ width: 300, marginBottom: 20 }} active size="large" />

          <Row gutter={24}>
            <Col span={16}>
              <Card style={{ marginBottom: '20px' }}>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
              <Card>
                <Skeleton active paragraph={{ rows: 4 }} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Skeleton active paragraph={{ rows: 6 }} />
              </Card>
            </Col>
          </Row>
        </Content>
      </Layout>
    );
  }

  if (!orderDetails) {
    return <div className="mt-3 container">Đơn hàng không tồn tại</div>;
  }

  const { orderDto, cartProductDtoList } = orderDetails;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + ' đ';
  };

  const styles = `
    .order-detail-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 20px;
      background-color: #f9fafc;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
      position: relative;
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

    .summary {
      display: flex;
      justify-content: flex-end;
      margin-bottom: 20px;
      margin-left: auto;
      width: auto;
    }

    .summary-table {
      width: 300px;
      text-align: right;
      margin-right: 0;
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

    .refund-button {
    background-color: #f5222d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-weight: 500;
  }

  .refund-button:hover {
    background-color: #cf1322;
  }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="mt-3 container">
        <div className="header">
          <h1>Chi tiết đơn hàng #{orderDto.id} - {orderDto.orderStatus}</h1>
          <span className="date">Ngày đặt hàng: {formatDate(orderDto.orderTime)}</span>
        </div>

        <div className="info-section">
          <div className="info-block">
            <h3>Địa chỉ người nhận</h3>
            <p>{orderDto.firstName} {orderDto.lastName}</p>
            <p>Địa chỉ: {orderDto.addressLine}</p>
            <p>Điện thoại: {orderDto.phoneNumber}</p>
          </div>
          <div className="info-block">
            <h3>Hình thức giao hàng</h3>

            <p>Dự kiến giao: {formatDate(orderDto.deliverDate)}</p>
            <p>Phí vận chuyển: {formatPrice(orderDto.shippingCost)}</p>

          </div>
          <div className="info-block">
            <h3>Hình thức thanh toán</h3>
            <p>{orderDto.paymentMethod === 'COD' ? 'Thanh toán khi nhận hàng' : orderDto.paymentMethod}</p>
            <p>{orderDto.orderStatus}</p>
          </div>
        </div>

        <div className="items-table">
          <table>
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Giá</th>
                <th>Số lượng</th>
                <th>Tạm tính</th>
                <th>Đánh giá</th>
              </tr>
            </thead>
            <tbody>
              {cartProductDtoList.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div className="product-info">
                      <img src={item.photo ? item.photo : '/src/assets/product-images/default-image.jpg'}
                        alt={item.productName} />
                      <div className="details">

                        <span className="name">{item.productName}</span>
                        <span className="publisher">Cung cấp bởi {item.shopName}</span>
                        {item.attributes && <span>{item.attributes}</span>}

                      </div>
                    </div>
                  </td>
                  <td>{formatPrice(item.lastPrice)}</td>
                  <td>{item.quantity}</td>
                  <td>{formatPrice(item.lastPrice * item.quantity)}</td>
                  {
                    item.reviewed === true && (
                      <td>
                        <Link to={`/p/${item.productAlias}#ratingAndReview`} className="btn btn-success">Xem đánh giá</Link>
                      </td>
                    )
                  }
                  {
                    item.reviewed === false && (
                      <td>
                        <Link to={`/p/${item.productAlias}#ratingAndReview`} className="btn btn-primary">Đánh giá</Link>
                      </td>
                    )
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="summary">
          <div className="summary-table">
            <div>
              <span>Tạm tính</span>
              <span>{formatPrice(orderDto.productCost)}</span>
            </div>
            <div>
              <span>Phí vận chuyển</span>
              <span>{formatPrice(orderDto.shippingCost)}</span>
            </div>
            <div className="total">
              <span>Tổng cộng</span>
              <span>{formatPrice(orderDto.total)}</span>
            </div>
          </div>
        </div>

        <div className="footer">
          <a href="/orders" className="back-link">
            <span>{'<'}</span> Quay lại đơn hàng của tôi
          </a>
        </div>

        {isEligibleForRefund && (
            <Button 
              type="primary" 
              danger
              onClick={() => setIsRefundModalVisible(true)}
              className="refund-button"
            >
              Yêu cầu hoàn tiền
            </Button>
          )}

                  {/* Modal hoàn tiền */}
        <Modal
          title="Yêu cầu hoàn tiền"
          open={isRefundModalVisible}
          onOk={handleRefund}
          onCancel={() => setIsRefundModalVisible(false)}
          okText="Xác nhận hoàn tiền"
          cancelText="Hủy"
          confirmLoading={isRefunding}
        >
          <p>Vui lòng nhập lý do hoàn tiền:</p>
          <TextArea
            rows={4}
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            placeholder="Nhập lý do hoàn tiền..."
          />
        </Modal>
      </div>
    </>
  );
};

export default OrderDetail;