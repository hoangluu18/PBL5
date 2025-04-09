import React, { useContext, useEffect, useState } from "react";
import { Pagination, Table, Tag, Typography, Spin, Empty } from "antd";
import { 
    ShoppingOutlined, 
    DollarOutlined, 
    ClockCircleOutlined, 
    FileTextOutlined,
    WalletOutlined,    
    CreditCardOutlined,
    PayCircleOutlined  
} from '@ant-design/icons';
import axios from "axios";
import { AuthContext } from "../context/auth.context";
const { Text, Title } = Typography;

const statusColorMap: Record<string, string> = {
    DELIVERED: "green",
    SHIPPING: "blue",
    NEW: "orange",
    PACKAGED: "geekblue",
    PAID: "cyan",
    PICKED: "purple",
    PROCCESSING: "processing",
    REFUNDED: "red",
    RETURNED: "volcano",
    RETURN_REQUESTED: "warning"
};

const paymentMethodMap: Record<string, string> = {
    COD: "Thanh toán tiền mặt",
    CREDIT_CARD: "Thẻ tín dụng",
    PAYPAL: "Paypal"
  };

  const statusMap: Record<string, string> = {
    DELIVERED: "Đã giao",
    NEW: "Mới",
    PACKAGED: "Đã đóng gói",
    PAID: "Đã thanh toán",
    PICKED: "Đã lấy hàng",
    PROCCESSING: "Đang xử lý",
    REFUNDED: "Đã hoàn tiền",
    RETURNED: "Đã trả hàng",
    SHIPPING: "Đang giao",
    RETURN_REQUESTED: "Yêu cầu trả hàng"
  };

  const paymentIconMap: Record<string, React.ReactNode> = {
    COD: <WalletOutlined style={{ color: "#722ed1", marginRight: 8, fontSize: 16 }} />,
    CREDIT_CARD: <CreditCardOutlined style={{ color: "#722ed1", marginRight: 8, fontSize: 16 }} />,
    PAYPAL: <PayCircleOutlined style={{ color: "#722ed1", marginRight: 8, fontSize: 16 }} />
};

// Hàm trợ giúp để tạo config với header xác thực
const getAuthConfig = () => {
  return {
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
  };
};

    // Hàm format ngày giờ
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleString("en-GB", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        }).replace(",", "");
    };

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 5;

  const { customer } = useContext(AuthContext);
    const customerId = customer?.id;
  useEffect(() => {
    axios.get(`http://localhost:8081/api/profile/${customerId}/orders?page=${currentPage - 1}&size=${pageSize}`,getAuthConfig())
      .then(res => {
        setOrders(res.data.data);
        setTotalItems(res.data.totalItems);
      })
      .catch(err => console.error("Fetch orders failed", err));
  }, [currentPage]);

  const columns = [
    { title: "Mã đơn hàng", dataIndex: "id", key: "id", render: (text: string) => (
        <div style={{ display: "flex" }}>
          <FileTextOutlined style={{ color: "#1890ff", marginRight: 8, fontSize: 16 }} />
          <Text strong>#{text}</Text>
        </div>
      ) },
    {
        title: "Trạng thái",
        dataIndex: "orderStatus",
        key: "status",
        render: (status: string, record: any) => (
            <div style={{ display: "flex"}}>
              <Tag color={statusColorMap[status] || "default"} style={{ fontSize: "14px", padding: "2px 10px" }}>
                {statusMap[status] || status}
              </Tag>
            </div>
          )
    },
    {
        title: "Phương thức thanh toán",
        dataIndex: "paymentMethod",
        key: "delivery",
        render: (method: string) => (
            <div style={{ display: "flex"}}>
                {paymentIconMap[method] || <WalletOutlined style={{ color: "#722ed1", marginRight: 8, fontSize: 16 }} />}
                <Text>{paymentMethodMap[method] || method}</Text>
            </div>
        )
    },
      
    { 
      title: "Ngày đặt hàng", 
      dataIndex: "orderTime", 
      key: "date",
      render: (value: string) => (
        <div style={{ display: "flex", alignItems: "center"}}>
          <ClockCircleOutlined style={{ color: "#1890ff", marginRight: 8, fontSize: 16 }} />
          <Text>{formatDate(value)}</Text>
        </div>
      )
    },
    { title: "Tổng cộng", dataIndex: "total", key: "total", render: (total: number) => (
        <div style={{ display: "flex"}}>
          <DollarOutlined style={{ color: "#52c41a", marginRight: 8, fontSize: 16 }} />
          <Text strong style={{ fontSize: "15px" }}>
            {total.toLocaleString("vi-VN")}₫
          </Text>
        </div>
      ) },
  ];

  return (
    <div className="bg-white p-3">
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        pagination={false}
      />
      <Pagination
        className="text-center mt-3"
        current={currentPage}
        total={totalItems}
        pageSize={pageSize}
        onChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default OrderList;
