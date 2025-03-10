import React from 'react';
import { Card, Button } from 'antd';
import { UserOutlined, HomeOutlined, PhoneOutlined } from '@ant-design/icons';

const ShippingInfo: React.FC = () => {

    const fullName = "Lưu Việt Hoàng";
    const address = "158 Nguyễn Lương Bằng, Hòa Khánh Nam, Liên Chiểu, Đà Nẵng";
    const phone = "0938583857";

    return (
        <Card
            title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Thông tin giao hàng</span>
                    <Button type="link" style={{ padding: 0 }}>Sửa</Button>
                </div>
            }
            bordered={false}
            style={{ marginBottom: '20px' }}
        >
            <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ width: '30px' }}>
                        <UserOutlined />
                    </div>
                    <div style={{ width: '100px' }}>Tên</div>
                    <div style={{ flex: 1 }}>: {fullName}</div>
                </div>

                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ width: '30px' }}>
                        <HomeOutlined />
                    </div>
                    <div style={{ width: '100px' }}>Địa chỉ</div>
                    <div style={{ flex: 1 }}>
                        : {address}
                    </div>
                </div>

                <div style={{ display: 'flex', marginBottom: '10px' }}>
                    <div style={{ width: '30px' }}>
                        <PhoneOutlined />
                    </div>
                    <div style={{ width: '100px' }}>Điện thoại</div>
                    <div style={{ flex: 1 }}>: {phone}</div>
                </div>
            </div>
        </Card>
    );
};

export default ShippingInfo;