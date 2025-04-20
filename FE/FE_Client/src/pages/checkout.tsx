import React, { useState, useEffect, useContext } from 'react';
import { Layout, Row, Col, Space, Button, Typography, Card, Skeleton, Result } from 'antd';
import { RightOutlined, ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import ShippingInfo from '../components/ShippingInfo';
import PaymentMethod from '../components/PaymentMethod';
import OrderSummary from '../components/OrderSummary';
import { getCheckoutInfoForSelectedCartItems, saveCheckout, saveCheckoutBuyNow } from '../services/checkout.service';
import { CheckoutInfoDto } from '../models/dto/checkout/CheckoutInfoDto';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from "../components/context/auth.context";

import { clearBuyNowData } from '../services/checkout.service';

const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout: React.FC = () => {
    const { customer } = useContext(AuthContext);
    const customerId = customer?.id;
    const navigate = useNavigate();

    // Định nghĩa tất cả state ở đầu component
    const [deliveryType, setDeliveryType] = useState('standard');
    const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfoDto | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [selectedCartIds, setSelectedCartIds] = useState<number[]>([]);

    // Hook để xóa dữ liệu khi rời khỏi trang
    useEffect(() => {
        return () => {
            // Cleanup function sẽ chạy khi component unmount
            clearBuyNowData();
        };
    }, []);
    // Trong useEffect của trang checkout
    useEffect(() => {
        // Set document title
        document.title = "Thanh toán";

        // Fetch checkout info
        const fetchCheckoutInfo = async () => {
            if (!customerId) {
                setIsNotFound(true);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                // Kiểm tra xem có phải là "Mua ngay" không
                const isBuyNow = localStorage.getItem('isBuyNow') === 'true';

                if (isBuyNow && validateBuyNowData()) {
                    // Lấy thông tin từ localStorage
                    const buyNowInfo = localStorage.getItem('buyNowInfo');
                    if (buyNowInfo) {
                        setCheckoutInfo(JSON.parse(buyNowInfo));
                    }
                } else {

                    if (isBuyNow && !validateBuyNowData()) {
                        clearBuyNowData();
                    }

                    // Lấy danh sách các cart IDs đã chọn từ localStorage
                    const savedCartIds = localStorage.getItem('selectedCartIds');

                    if (savedCartIds) {
                        // Parse các cart ID đã chọn
                        const parsedCartIds = JSON.parse(savedCartIds) as number[];
                        setSelectedCartIds(parsedCartIds);

                        // Gọi API để lấy thông tin checkout cho các sản phẩm đã chọn
                        console.log('Fetching checkout info for selected cart items:', parsedCartIds);
                        const checkoutInfo = await getCheckoutInfoForSelectedCartItems(customerId, parsedCartIds);
                        setCheckoutInfo(checkoutInfo);
                    } else {
                        // Nếu không có cart ID đã chọn, gọi API lấy toàn bộ thông tin checkout
                        console.log('No product selected');
                    }
                }
            } catch (error) {
                console.error('Error fetching checkout info:', error);
                clearBuyNowData();
                // Check if this is a 404 error
                if (axios.isAxiosError(error) && error.response?.status === 404) {
                    setIsNotFound(true);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutInfo();
    }, [customerId]);

    // Cập nhật hàm handlePurchase để xử lý trường hợp "Mua ngay"
    const handlePurchase = () => {
        // Kiểm tra nếu không có customerId
        if (!customerId) {
            alert('Vui lòng đăng nhập để tiếp tục');
            navigate('/login');
            return;
        }

        // Kiểm tra nếu phương thức thanh toán không phải là COD
        if (paymentMethod !== 'cash') {
            alert('Phương thức thanh toán này chưa được hỗ trợ. Mong bạn thông cảm!');
            return;
        }

        // Nếu là COD, tiếp tục như bình thường
        if (window.confirm('Bạn có chắc chắn muốn mua hàng không?')) {
            setLoading(true);

            // Kiểm tra xem có phải là "Mua ngay" không
            const isBuyNow = localStorage.getItem('isBuyNow') === 'true';

            if (isBuyNow && validateBuyNowData()) {
                saveCheckoutBuyNow(customerId)
                    .then(() => {
                        alert('Đặt hàng thành công!');
                        clearBuyNowData(); // Xóa dữ liệu sau khi đặt hàng thành công
                        navigate('/');
                    })
                    .catch((error: any) => {
                        console.error('Lỗi khi đặt hàng:', error);
                        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            } else {
                // Xử lý trường hợp thông thường từ giỏ hàng
                saveCheckout(customerId, selectedCartIds)
                    .then(() => {
                        alert('Đặt hàng thành công!');
                        // Xóa localStorage sau khi đặt hàng thành công
                        localStorage.removeItem('selectedCartIds');
                        navigate('/'); // Chuyển về trang chủ
                    })
                    .catch((error: any) => {
                        console.error('Lỗi khi đặt hàng:', error);
                        alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            }
        }
    };

    const validateBuyNowData = (): boolean => {
        const buyNowTimestamp = localStorage.getItem('buyNowTimestamp');
        const buyNowInfo = localStorage.getItem('buyNowInfo');
        
        if (!buyNowTimestamp || !buyNowInfo) {
            return false;
        }
        
        // Kiểm tra thời gian lưu - nếu quá 30 phút (1800000ms) thì không hợp lệ
        const timestamp = parseInt(buyNowTimestamp);
        const now = Date.now();
        if (now - timestamp > 1800000) {
            return false;
        }
        
        return true;
    };

    // Tính toán subtotal, shippingCost và total
    const subtotal = checkoutInfo
        ? checkoutInfo.cartProductDtoList.reduce((sum, item) => sum + (item.lastPrice * item.quantity), 0)
        : 0;

    const shippingCost = checkoutInfo
        ? checkoutInfo.shippingRespondDtoList.reduce((sum, shipping) => sum + shipping.shippingCost, 0)
        : 0;

    const total = subtotal + shippingCost;

    // Các điều kiện render
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

    if (!customer) {
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
                    <Result
                        status="403"
                        title="Chưa đăng nhập"
                        subTitle="Vui lòng đăng nhập để tiếp tục thanh toán."
                        extra={[
                            <Button
                                type="primary"
                                key="login"
                                onClick={() => navigate('/login')}
                            >
                                Đăng nhập
                            </Button>,
                            <Button
                                key="home"
                                icon={<HomeOutlined />}
                                onClick={() => navigate('/')}
                            >
                                Quay về trang chủ
                            </Button>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    if (isNotFound) {
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
                    <Result
                        status="404"
                        title="Giỏ hàng trống"
                        subTitle="Bạn chưa chọn sản phẩm nào để thanh toán. Vui lòng thêm sản phẩm vào giỏ hàng trước."
                        extra={[
                            <Button
                                type="primary"
                                key="cart"
                                icon={<ShoppingCartOutlined />}
                                onClick={() => navigate('/cart')}
                            >
                                Quay về giỏ hàng
                            </Button>,
                            <Button
                                key="home"
                                icon={<HomeOutlined />}
                                onClick={() => navigate('/')}
                            >
                                Tiếp tục mua sắm
                            </Button>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    if (!checkoutInfo) {
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
                    <Result
                        status="error"
                        title="Lỗi tải thông tin"
                        subTitle="Có lỗi xảy ra khi tải thông tin thanh toán. Vui lòng thử lại sau."
                        extra={[
                            <Button
                                type="primary"
                                key="retry"
                                onClick={() => window.location.reload()}
                            >
                                Thử lại
                            </Button>,
                            <Button
                                key="home"
                                onClick={() => navigate('/')}
                            >
                                Quay về trang chủ
                            </Button>
                        ]}
                    />
                </Content>
            </Layout>
        );
    }

    // Render UI chính
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
                    <Space size="small">
                        <Button type="link" style={{ padding: 0 }} onClick={() => navigate('/')}>Trang chủ</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Button type="link" style={{ padding: 0 }} onClick={() => navigate('/cart')}>Giỏ hàng</Button>
                        <RightOutlined style={{ fontSize: '12px' }} />
                        <Text type="secondary">Thanh toán</Text>
                    </Space>
                </div>

                <Title level={2}>
                    Thanh toán {selectedCartIds.length > 0 ? `(${selectedCartIds.length} sản phẩm đã chọn)` : ''}
                </Title>

                <Row gutter={24}>
                    <Col span={16}>
                        <ShippingInfo addressInfo={checkoutInfo.addressInfoDto} />
                        <PaymentMethod
                            paymentMethod={paymentMethod}
                            setPaymentMethod={setPaymentMethod}
                            shippingCosts={checkoutInfo.shippingRespondDtoList.map(shipping => ({
                                shopId: shipping.shopId,
                                shopName: shipping.shippingCompany,
                                shippingCost: shipping.shippingCost
                            }))}
                        />
                    </Col>

                    <Col span={8}>
                        <OrderSummary
                            orderItems={checkoutInfo.cartProductDtoList.map(item => ({
                                id: item.productId,
                                name: item.productName,
                                price: item.lastPrice,
                                quantity: item.quantity,
                                image: `/src/assets/product-images/${item.photo}`,
                                shopId: item.shopId,
                                shopName: item.shopName
                            }))}
                            subtotal={subtotal}
                            shippingCost={shippingCost}
                            total={total}
                        />
                    </Col>
                </Row>

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <Button
                        type="primary"
                        size="large"
                        style={{ width: '300px', height: '45px' }}
                        onClick={handlePurchase}
                        loading={loading}
                    >
                        Mua hàng
                    </Button>
                </div>
            </Content>

            <style>{`
                .selected-delivery {
                    border: 2px solid #1890ff;
                }
                .ant-radio-wrapper {
                    margin-right: 0;
                }
            `}</style>
        </Layout>
    );
};

export default Checkout;