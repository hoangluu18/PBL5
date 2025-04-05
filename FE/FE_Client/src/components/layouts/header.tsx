import { Layout, Input, Badge, Space, Tooltip, Avatar, Dropdown, Button, Menu } from "antd";
import {
    SearchOutlined,
    ShoppingCartOutlined,
    BellOutlined,
    UserOutlined,
    HeartOutlined,
    LogoutOutlined,
    SettingOutlined,
    LoginOutlined
} from "@ant-design/icons";
import "antd/dist/reset.css";
import logo from '../../assets/logo.jpg';
import '../../css/style.css';
import { useNavigate } from "react-router";
import { useState } from "react";

const { Header } = Layout;

const App = () => {
    const navigate = useNavigate();
    // Set this to true when user is logged in
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Mock user data (replace with actual user data from your auth system)
    const userData = {
        name: "John Doe",
        avatar: null // URL to user avatar if available
    };

    const searchProducts = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value;
            navigate(`/search?keyword=${encodeURIComponent(value)}`);
        }
    };

    // Define the dropdown menu items for logged-in users
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
                    label: 'Settings',
                    icon: <SettingOutlined />,
                    onClick: () => navigate('/settings')
                },
                {
                    type: 'divider'
                },
                {
                    key: '4',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    onClick: () => {
                        // Add your logout logic here
                        setIsLoggedIn(false);
                        navigate('/');
                    }
                }
            ]}
        />
    );

    return (
        <>
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
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                cursor: "pointer"
                            }}
                            onClick={() => navigate('/')}
                        >
                            <img
                                src={logo}
                                alt="Logo"
                                style={{
                                    width: "130px",
                                    height: "65px",
                                    objectFit: "contain",
                                    transition: "transform 0.2s",
                                }}
                                onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                                onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
                            />
                        </div>

                        {/* Search Bar */}
                        <Input
                            placeholder="Search for products..."
                            prefix={<SearchOutlined style={{ color: "#1890ff" }} />}
                            onKeyDown={(e) => searchProducts(e)}
                            style={{
                                width: "50%",
                                borderRadius: "20px",
                                height: "42px",
                                boxShadow: "0 2px 5px rgba(0,0,0,0.07)",
                                transition: "all 0.3s ease",
                            }}
                            onFocus={(e) => e.target.style.boxShadow = "0 2px 8px rgba(24,144,255,0.2)"}
                            onBlur={(e) => e.target.style.boxShadow = "0 2px 5px rgba(0,0,0,0.07)"}
                        />

                        {/* Icons */}
                        <Space size="large">
                            <Tooltip title="Shopping Cart">
                                <Badge count={isLoggedIn ? 3 : 0} color="#1890ff" style={{ boxShadow: "0 0 0 2px #fff" }}>
                                    <ShoppingCartOutlined
                                        style={{
                                            fontSize: "24px",
                                            cursor: "pointer",
                                            color: "#555",
                                            transition: "color 0.3s"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = "#1890ff"}
                                        onMouseOut={(e) => e.currentTarget.style.color = "#555"}
                                        onClick={() => navigate('/cart')}
                                    />
                                </Badge>
                            </Tooltip>

                            {isLoggedIn && (
                                <Tooltip title="Favorites">
                                    <HeartOutlined
                                        style={{
                                            fontSize: "24px",
                                            cursor: "pointer",
                                            color: "#555",
                                            transition: "color 0.3s"
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.color = "#ff4d4f"}
                                        onMouseOut={(e) => e.currentTarget.style.color = "#555"}
                                        onClick={() => navigate('/favorites')}
                                    />
                                </Tooltip>
                            )}

                            {isLoggedIn && (
                                <Tooltip title="Notifications">
                                    <Badge dot color="#52c41a" style={{ boxShadow: "0 0 0 2px #fff" }}>
                                        <BellOutlined
                                            style={{
                                                fontSize: "24px",
                                                cursor: "pointer",
                                                color: "#555",
                                                transition: "color 0.3s"
                                            }}
                                            onMouseOver={(e) => e.currentTarget.style.color = "#52c41a"}
                                            onMouseOut={(e) => e.currentTarget.style.color = "#555"}
                                            onClick={() => navigate('/notifications')}
                                        />
                                    </Badge>
                                </Tooltip>
                            )}

                            {/* Show dropdown menu for logged in users, login button for logged out users */}
                            {isLoggedIn ? (
                                <Dropdown
                                    overlay={userMenu}
                                    placement="bottomRight"
                                    arrow
                                    trigger={['click']}
                                >
                                    <div
                                        style={{
                                            display: "inline-block",
                                            transition: "transform 0.3s",
                                        }}
                                        onMouseOver={(e) => {
                                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1.1)";
                                        }}
                                        onMouseOut={(e) => {
                                            (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                                        }}
                                    >
                                        <Avatar
                                            src={userData.avatar}
                                            icon={!userData.avatar && <UserOutlined />}
                                            style={{
                                                backgroundColor: userData.avatar ? 'transparent' : "#1890ff",
                                                color: "#fff",
                                                cursor: "pointer",
                                            }}
                                            size="large"
                                        />
                                    </div>
                                </Dropdown>
                            ) : (
                                <Button
                                    type="primary"
                                    icon={<LoginOutlined />}
                                    onClick={() => {
                                        // For demo purposes, we'll just toggle the state
                                        // In a real app, this would navigate to login page
                                        setIsLoggedIn(true);
                                        // navigate('/login');
                                    }}
                                    style={{
                                        borderRadius: "20px",
                                        display: "flex",
                                        alignItems: "center"
                                    }}
                                >
                                    Login
                                </Button>
                            )}
                        </Space>
                    </Header>
                </div>
            </div>
        </>
    );
};

export default App;