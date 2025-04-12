import {
    Layout, Input, Badge, Space, Tooltip, Avatar, Dropdown, Button, Menu
} from "antd";
import {
    SearchOutlined, ShoppingCartOutlined, BellOutlined,
    UserOutlined, HeartOutlined, LogoutOutlined,
    LoginOutlined
} from "@ant-design/icons";
import "antd/dist/reset.css";
import logo from '../../assets/logo.jpg';
import '../../css/style.css';
import { useNavigate } from "react-router";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/auth.context";
import CartService from "../../services/cart.service";

const { Header } = Layout;

const App = () => {
    const navigate = useNavigate();
    const { customer, setCustomer } = useContext(AuthContext);
    const [count, setCount] = useState<number>(0);

    const isLoggedIn = customer.id !== 0;

    const searchProducts = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value;
            navigate(`/search?keyword=${encodeURIComponent(value)}`);
        }
    };

    useEffect(() => {
        const cartService = new CartService();
        cartService.countProductByCustomerId(customer.id).then((data) => {
            setCount(data);
        }).catch((error) => {
            console.error("Failed to fetch cart count:", error);
        });
    }, []);

    const userMenu = (
        <Menu
            items={[
                {
                    key: '1',
                    label: 'My Profile',
                    icon: <UserOutlined />,
                    onClick: () => navigate('/profile')
                },
                {
                    key: '2',
                    label: 'Favorites',
                    icon: <HeartOutlined />,
                    onClick: () => navigate('/favorites')
                },
                {
                    key: '3',
                    label: 'Đơn hàng của tôi',
                    icon: <ShoppingCartOutlined />,
                    onClick: () => navigate('/orders')
                },
                {
                    type: 'divider'
                },
                {
                    key: '4',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    onClick: () => {
                        localStorage.removeItem("access_token");
                        localStorage.removeItem("customer");
                        setCustomer({
                            id: 0,
                            username: "",
                            email: "",
                            phoneNumber: "",
                            avatar: ""
                        });
                        navigate('/login');
                    }
                }
            ]}
        />
    );

    return (
        <div className="container-fluid bg-white shadow-sm">
            <div className="container">
                <Header
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#fff",
                        padding: "10px 20px",
                        height: "80px",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                    }}
                >
                    {/* Logo */}
                    <div style={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate('/')}>
                        <img
                            src={logo}
                            alt="Logo"
                            style={{
                                width: "130px",
                                height: "65px",
                                objectFit: "contain",
                                transition: "transform 0.2s",
                            }}
                            onMouseOver={e => e.currentTarget.style.transform = "scale(1.05)"}
                            onMouseOut={e => e.currentTarget.style.transform = "scale(1)"}
                        />
                    </div>

                    {/* Search Bar */}
                    <Input
                        placeholder="Search for products..."
                        prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                        onKeyDown={searchProducts}
                        style={{
                            width: "50%",
                            borderRadius: "20px",
                            height: "42px",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
                        }}
                    />

                    {/* Icons */}
                    <Space size="large">
                        <Tooltip title="Shopping Cart">
                            <Badge count={isLoggedIn ? count : ''} color="#1890ff">
                                <ShoppingCartOutlined
                                    style={{ fontSize: "24px", cursor: "pointer", color: "#555" }}
                                    onClick={() => navigate('/cart')}
                                />
                            </Badge>
                        </Tooltip>

                        {isLoggedIn && (
                            <>
                                <Tooltip title="Favorites">
                                    <HeartOutlined
                                        style={{ fontSize: "24px", cursor: "pointer", color: "#555" }}
                                        onClick={() => navigate('/favorites')}
                                    />
                                </Tooltip>

                                <Tooltip title="Notifications">
                                    <Badge dot color="#52c41a">
                                        <BellOutlined
                                            style={{ fontSize: "24px", cursor: "pointer", color: "#555" }}
                                            onClick={() => navigate('/notifications')}
                                        />
                                    </Badge>
                                </Tooltip>

                                <Dropdown overlay={userMenu} trigger={['hover']} placement="bottomRight" arrow>
                                    <div style={{ display: "inline-block", cursor: "pointer" }}>
                                        <Avatar
                                            src={customer.avatar || undefined}
                                            icon={!customer.avatar && <UserOutlined />}
                                            style={{
                                                backgroundColor: customer.avatar ? 'transparent' : "#1890ff",
                                                color: "#fff",
                                            }}
                                            size="large"
                                        />
                                    </div>
                                </Dropdown>
                            </>
                        )}

                        {!isLoggedIn && (
                            <Button
                                type="primary"
                                icon={<LoginOutlined />}
                                onClick={() => navigate('/login')}
                                style={{ borderRadius: "20px" }}
                            >
                                Login
                            </Button>
                        )}
                    </Space>
                </Header>
            </div>
        </div>
    );
};

export default App;
