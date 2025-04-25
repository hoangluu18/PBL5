import { Layout, Menu } from 'antd';
import {
    AppstoreOutlined,
    ShoppingOutlined,
    SwapOutlined,
    UserOutlined,
    BarChartOutlined,
    FileTextOutlined,
} from '@ant-design/icons';
import { Link } from 'react-router';
import { use, useContext } from 'react';
import { AuthContext } from '../../utils/auth.context';


const { Header } = Layout;

const NavBar = () => {

    const { user } = useContext(AuthContext);

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
                                >
                                    <Menu.Item key="overview" icon={<AppstoreOutlined />}>
                                        <Link to="/" className='text-decoration-none'>Tổng quan</Link>
                                    </Menu.Item>
                                    <Menu.Item key="products" icon={<ShoppingOutlined />}>
                                        <Link to="/invoice" className='text-decoration-none'>Hóa đơn</Link>
                                    </Menu.Item>
                                    <Menu.Item key="transactions" icon={<SwapOutlined />}>
                                        Giao dịch
                                    </Menu.Item>
                                    <Menu.Item key="customers" icon={<UserOutlined />}>
                                        Khách hàng
                                    </Menu.Item>
                                    <Menu.Item key="inventory" icon={<BarChartOutlined />}>
                                        Số quỹ
                                    </Menu.Item>
                                    <Menu.Item key="reports" icon={<FileTextOutlined />}>
                                        Báo cáo
                                    </Menu.Item>
                                    {user &&
                                        <Menu.Item key="user" icon={<UserOutlined />}>
                                            {user.name}
                                        </Menu.Item>
                                    }
                                    {
                                        !user &&
                                        <Menu.Item key="login" icon={<UserOutlined />} className='text-decoration-none'>
                                            <Link to="/login" className='text-decoration-none'>Đăng nhập</Link>
                                        </Menu.Item>
                                    }

                                </Menu>
                            </div>
                        </div>
                    </Header>
                </Layout>
            </div>
        </div>
    );
};

export default NavBar;