import { Button, Typography, Space, Avatar } from "antd";
import { MessageOutlined, ShopOutlined } from "@ant-design/icons";
import IShopDto from "../../models/dto/ShopDto";
import { Link } from "react-router-dom";

const { Text } = Typography;

const ShopInfo = (shop: IShopDto) => {

    const getRelativeTime = (dateString: string) => {
        const createdAt = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

        const intervals = [
            { label: "năm", seconds: 31536000 },
            { label: "tháng", seconds: 2592000 },
            { label: "ngày", seconds: 86400 },
            { label: "giờ", seconds: 3600 },
            { label: "phút", seconds: 60 },
            { label: "giây", seconds: 1 }
        ];

        for (const interval of intervals) {
            const count = Math.floor(diffInSeconds / interval.seconds);
            if (count >= 1) {
                return `${count} ${interval.label} trước`;
            }
        }

        return "Vừa xong";
    };


    return (
        <div style={{ backgroundColor: "white", width: "100%" }} className="p-3">
            <div className="d-flex justify-content-between">
                <div className="d-flex">
                    <Link to={`/shop/${shop.id}`}><Avatar size={64} src={shop.photo} /></Link>
                    <div style={{ marginLeft: 16, flex: 1 }}>
                        <Text strong style={{ fontSize: 16 }}>{shop.name}</Text>
                        <Text type="secondary" style={{ display: "block" }}>Online 10 Phút Trước</Text>
                        <Space style={{ marginTop: 8 }}>
                            <Button type="default" icon={<MessageOutlined />} style={{ borderColor: "#f5222d", color: "#f5222d" }}>Chat Ngay</Button>
                            <Button icon={<ShopOutlined />}> <Link to={`/shop/${shop.id}`}>Xem Shop</Link></Button>
                        </Space>
                    </div>
                </div>

                <div className="d-flex justify-content-end w-50">
                    <div>
                        <Text>Đánh Giá: <Text strong type="danger">{shop.rating}</Text></Text><br />
                        <Text>Sản Phẩm: <Text strong type="danger">{shop.productAmount}</Text></Text>
                    </div>
                    <div className="me-3">&nbsp;</div>
                    <div>
                        <Text>Tham Gia: <Text strong type="danger">{getRelativeTime(shop.createdAt)}</Text></Text><br />
                        <Text>Người Theo Dõi: <Text strong type="danger">{shop.peopleTracking}</Text></Text>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default ShopInfo;
