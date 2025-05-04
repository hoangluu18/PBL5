import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    ShoppingOutlined,
    SwapOutlined,
    UserOutlined,
    BarChartOutlined,
    FileTextOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../utils/auth.context';

const { Header } = Layout;

const NavBar = () => {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    // Định nghĩa menuItems ngoài JSX
    const menuItems = [
        {
            key: "overview",
            icon: <AppstoreOutlined />,
            label: <Link to="/" className='text-decoration-none'>Tổng quan</Link>
        },
        {
            key: "products",
            icon: <ShoppingOutlined />,
            label: <Link to="/invoice" className='text-decoration-none'>Hóa đơn</Link>
        },
        {
            key: "transactions",
            icon: <SwapOutlined />,
            label: "Giao dịch"
        },
        {
            key: "customers",
            icon: <UserOutlined />,
            label: "Khách hàng"
        },
        {
            key: "inventory",
            icon: <BarChartOutlined />,
            label: "Số quỹ"
        },
        {
            key: "reports",
            icon: <FileTextOutlined />,
            label: "Báo cáo"
        }
    ];

    // Thêm các mục menu phụ thuộc vào trạng thái đăng nhập
    if (user.id) {
        menuItems.push(
            {
                key: "user",
                icon: <UserOutlined />,
                label: user.name
            },
            {
                key: "logout",
                icon: <LogoutOutlined />,
                label: <span onClick={() => {
                    setUser({
                        id: 0,
                        name: "",
                        photo: "",
                        roles: []
                    });
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("user");
                    navigate("/login");
                }}>Đăng xuất</span>
            }
        );
    } else {
        menuItems.push({
            key: "login",
            icon: <UserOutlined />,
            label: <Link to="/login" className='text-decoration-none'>Đăng nhập</Link>
        });
    }

    return (
        <div className='container-fluid' style={{ padding: 0, background: '#0d6efd' }}>
            <div className='container'>
                <Layout className="layout">
                    <Header style={{ padding: 0, background: '#0d6efd' }}>
                        <div className="container-fluid">
                            <div className="d-flex align-items-center justify-content-between">
                                <Menu
                                    mode="horizontal"
                                    theme="dark"
                                    style={{ background: '#0d6efd', color: 'white', border: 'none', overflowX: 'auto', whiteSpace: 'nowrap' }}
                                    className="flex-grow-1 justify-content-end"
                                    items={menuItems}
                                />
                            </div>
                        </div>
                    </Header>
                </Layout>
            </div>
        </div>
    );
};

export default NavBar;