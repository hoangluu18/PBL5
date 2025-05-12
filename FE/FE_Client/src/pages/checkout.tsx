import React, { useState, useEffect, useContext } from 'react';
import { Layout, Row, Col, Space, Button, Typography, Card, Skeleton, Result, Modal, message } from 'antd';
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
import CartService from '../services/cart.service';
import WalletService from '../services/wallet.service';
import PaymentService from '../services/payment.service'
const { Content } = Layout;
const { Title, Text } = Typography;

const Checkout: React.FC = () => {
    const { customer, setCartCount } = useContext(AuthContext);
    const customerId = customer?.id;
    const navigate = useNavigate();

    // Định nghĩa tất cả state ở đầu component
    const [checkoutInfo, setCheckoutInfo] = useState<CheckoutInfoDto | null>(null);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [loading, setLoading] = useState(true);
    const [isNotFound, setIsNotFound] = useState(false);
    const [selectedCartIds, setSelectedCartIds] = useState<number[]>([]);
    const [noAddressFound, setNoAddressFound] = useState(false);
    const [processingPayment, setProcessingPayment] = useState<boolean>(false);
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
                        const parsedData = JSON.parse(buyNowInfo);
                        // Kiểm tra nếu không có địa chỉ
                        if (!parsedData.addressInfoDto || !parsedData.addressInfoDto.address) {
                            setNoAddressFound(true);
                            return;
                        }
                        setCheckoutInfo(parsedData);
                    }
                } else {
                    if (isBuyNow && !validateBuyNowData()) {
                        clearBuyNowData();
                    }

                    // Lấy danh sách các cart IDs đã chọn từ localStorage
                    const savedCartIds = localStorage.getItem('selectedCartIds');

                    if (savedCartIds) {
                        try {
                            // Parse các cart ID đã chọn
                            const parsedCartIds = JSON.parse(savedCartIds) as number[];
                            setSelectedCartIds(parsedCartIds);

                            // Gọi API để lấy thông tin checkout cho các sản phẩm đã chọn
                            console.log('Fetching checkout info for selected cart items:', parsedCartIds);
                            const checkoutInfo = await getCheckoutInfoForSelectedCartItems(customerId, parsedCartIds);

                            // Kiểm tra nếu không có địa chỉ
                            if (!checkoutInfo.addressInfoDto || Object.keys(checkoutInfo.addressInfoDto).length === 0) {
                                setNoAddressFound(true);
                                return;
                            }

                            setCheckoutInfo(checkoutInfo);
                        } catch (error) {
                            // Kiểm tra lỗi từ API
                            if (axios.isAxiosError(error)) {
                                if (error.response?.data?.message?.includes('address') ||
                                    error.response?.status === 400) {
                                    setNoAddressFound(true);
                                    return;
                                }
                            }
                            throw error; // Ném lỗi để catch bên ngoài xử lý
                        }
                    } else {
                        // Nếu không có cart ID đã chọn, gọi API lấy toàn bộ thông tin checkout
                        console.log('No product selected');
                        setIsNotFound(true);
                    }
                }
            } catch (error) {
                console.error('Error fetching checkout info:', error);
                clearBuyNowData();

                // Kiểm tra nếu là lỗi địa chỉ
                if (axios.isAxiosError(error)) {
                    // Kiểm tra các trường hợp lỗi liên quan đến địa chỉ
                    if (error.response?.status === 404 &&
                        error.response?.data?.message?.includes('address')) {
                        setNoAddressFound(true);
                        return;
                    } else if (error.response?.status === 404) {
                        setIsNotFound(true);
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCheckoutInfo();
    }, [customerId]);

    const updateCartCount = async () => {
        try {
            const cartService = new CartService();
            const cartCount = await cartService.countProductByCustomerId(customer.id);
            setCartCount(cartCount);
        } catch (error) {
            console.error('Error updating cart count:', error);
        }
    };

    // Cập nhật hàm handlePurchase để xử lý trường hợp "Mua ngay"
    const handlePurchase = async () => {
        // Kiểm tra nếu không có customerId
        if (!customerId) {
            alert('Vui lòng đăng nhập để tiếp tục');
            navigate('/login');
            return;
        }

        if (paymentMethod === 'wallet') {
            try {
                setProcessingPayment(true);
                // Kiểm tra số dư
                const balanceCheck = await WalletService.checkBalance(customerId, total);

                if (!balanceCheck.hasEnoughBalance) {
                    Modal.confirm({
                        title: 'Số dư không đủ',
                        content: (
                            <div>
                                <p>Số dư hiện tại: {new Intl.NumberFormat('vi-VN').format(balanceCheck.currentBalance)} VNĐ</p>
                                <p>Số tiền cần thanh toán: {new Intl.NumberFormat('vi-VN').format(balanceCheck.requiredAmount)} VNĐ</p>
                                <p>Bạn cần nạp thêm {new Intl.NumberFormat('vi-VN').format(balanceCheck.requiredAmount - balanceCheck.currentBalance)} VNĐ</p>
                            </div>
                        ),
                        okText: 'Nạp tiền ngay',
                        cancelText: 'Hủy',
                        onOk: () => {
                            navigate('/wallet/deposit');
                        }
                    });
                    setProcessingPayment(false);
                    return;
                }
            } catch (error) {
                console.error('Lỗi kiểm tra số dư:', error);
                message.error('Không thể kiểm tra số dư. Vui lòng thử lại sau.');
                setProcessingPayment(false);
                return;
            }
        }
        if (window.confirm('Bạn có chắc chắn muốn mua hàng không?')) {
            setLoading(true);

            // Kiểm tra xem có phải là "Mua ngay" không
            const isBuyNow = localStorage.getItem('isBuyNow') === 'true';

            try {
                let response;
                let orderId;

                // Lưu đơn hàng trước
                if (isBuyNow && validateBuyNowData()) {
                    response = await saveCheckoutBuyNow(customerId, paymentMethod);
                    orderId = response.orderId;
                } else {
                    response = await saveCheckout(customerId, selectedCartIds, paymentMethod);
                    orderId = response.orderId;
                }

                // Nếu thanh toán qua ví, tiến hành xử lý thanh toán
// Trong hàm handlePurchase
                if (paymentMethod === 'wallet' && orderId) {
                    try {
                        const paymentResult = await PaymentService.payWithWallet(customerId, orderId, total);
                        message.success('Thanh toán thành công qua ví!');

                        // Xử lý bước tiếp theo chỉ khi thanh toán thành công
                        if (isBuyNow) {
                            clearBuyNowData();
                        } else {
                            localStorage.removeItem('selectedCartIds');
                        }

                        updateCartCount();
                        // Chuyển đến trang đơn hàng
                        navigate('/orders');
                        return; // Dừng xử lý ở đây
                    } catch (error: any) {
                        console.error('Lỗi thanh toán:', error);
                        if (error.response?.data?.message === 'Số dư không đủ') {
                            Modal.confirm({
                                title: 'Thanh toán thất bại',
                                content: 'Số dư trong ví của bạn không đủ. Bạn có muốn nạp thêm tiền không?',
                                okText: 'Nạp tiền',
                                cancelText: 'Hủy',
                                onOk: () => {
                                    navigate('/wallet/deposit');
                                }
                            });
                        } else {
                            message.error('Có lỗi xảy ra khi thanh toán. Vui lòng thử lại sau.');
                        }
                        setLoading(false);
                        setProcessingPayment(false);
                        return; // Thêm return để dừng luồng khi có lỗi
                    }
                }

                // Xử lý các bước sau khi đặt hàng thành công
                if (isBuyNow) {
                    clearBuyNowData();
                } else {
                    localStorage.removeItem('selectedCartIds');
                }

                updateCartCount();
                message.success('Đặt hàng thành công!');
                navigate('/orders');  // Chuyển về trang đơn hàng thay vì trang chủ
            } catch (error) {
                console.error('Lỗi khi đặt hàng:', error);
                message.error('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại sau.');
            } finally {
                setLoading(false);
                setProcessingPayment(false);
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

    // Thêm sau phần điều kiện isNotFound
    if (noAddressFound) {
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
                        status="warning"
                        title="Chưa có địa chỉ giao hàng"
                        subTitle="Bạn cần thêm địa chỉ giao hàng để có thể tiến hành thanh toán."
                        extra={[
                            <Button
                                type="primary"
                                key="addAddress"
                                onClick={() => navigate('/edit-address')}
                            >
                                Thêm địa chỉ giao hàng
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
                            totalAmount={total}
                        />
                    </Col>

                    <Col span={8}>
                        <OrderSummary
                            orderItems={checkoutInfo.cartProductDtoList.map(item => ({
                                id: item.productId,
                                name: item.productName,
                                price: item.lastPrice,
                                quantity: item.quantity,
                                image: item.photo || '', // Provide empty string as fallback when photo is null
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