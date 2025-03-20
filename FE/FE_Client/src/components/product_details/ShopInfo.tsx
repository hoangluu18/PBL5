import { Button, Typography, Space, Avatar } from "antd";
import { MessageOutlined, ShopOutlined } from "@ant-design/icons";

const { Text } = Typography;

const ShopInfo = () => {
    return (
        <div style={{ backgroundColor: "white", width: "100%" }} className="p-3">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <Avatar size={64} src="/logo.png" />
                    <div style={{ marginLeft: 16, flex: 1 }}>
                        <Text strong style={{ fontSize: 16 }}>Topick Global</Text>
                        <Text type="secondary" style={{ display: "block" }}>Online 10 Phút Trước</Text>
                        <Space style={{ marginTop: 8 }}>
                            <Button type="default" icon={<MessageOutlined />} style={{ borderColor: "#f5222d", color: "#f5222d" }}>Chat Ngay</Button>
                            <Button icon={<ShopOutlined />}>Xem Shop</Button>
                        </Space>
                    </div>
                </div>

                <div className="d-flex justify-content-between text-left w-50">
                    <div>
                        <Text>Đánh Giá: <Text strong type="danger">5,5tr</Text></Text><br />
                        <Text>Sản Phẩm: <Text strong type="danger">70,1k</Text></Text>
                    </div>
                    <div>
                        <Text>Tỉ Lệ Phản Hồi: <Text strong type="danger">98%</Text></Text><br />
                        <Text>Thời Gian Phản Hồi: <Text strong type="danger">trong vài phút</Text></Text>
                    </div>
                    <div>
                        <Text>Tham Gia: <Text strong type="danger">5 năm trước</Text></Text><br />
                        <Text>Người Theo Dõi: <Text strong type="danger">4,7tr</Text></Text>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ShopInfo;
