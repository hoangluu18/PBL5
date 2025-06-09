import React, { useContext } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    DashboardOutlined,
    UserOutlined,
    LogoutOutlined,
    DownOutlined,
    SettingOutlined,
    BranchesOutlined,
    CaretRightOutlined,
    RedditSquareFilled
} from '@ant-design/icons';
import { AuthContext } from '../../utils/auth.context';

const { Header, Content } = Layout;

const NavBar: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useContext(AuthContext);
    document.title = 'Admin Panel'
    const menuItems = [
        {
            key: 'dashboard',
            icon: <DashboardOutlined />,
            label: 'Dashboard',
            onClick: () => navigate('/admin/dashboard')
        },
        {
            key: 'shops',
            icon: <UserOutlined />,
            label: 'Cửa hàng',
            onClick: () => navigate('/admin/shops')
        },
        {
            key: 'brands',
            icon: <BranchesOutlined />,
            label: 'Nhãn hàng',
            onClick: () => navigate('/admin/brands')
        },
        {
            key: 'categories',
            icon: <CaretRightOutlined />,
            label: 'Danh mục',
            onClick: () => navigate('/admin/categories')
        },
        {
            key: 'store_requests',
            icon: <RedditSquareFilled />,
            label: 'Yêu cầu cửa hàng',
            onClick: () => navigate('/admin/store_requests')
        },
        {
            key: 'settings',
            icon: <SettingOutlined />,
            label: 'settings',
            onClick: () => navigate('/admin/settings')
        },
    ];

    const userMenuItems = [
        {
            key: '1',
            label: 'Profile',
            icon: <UserOutlined />,
        },
        {
            key: '2',
            label: 'Logout',
            icon: <LogoutOutlined />,
            onClick: logout
        },
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Header style={{
                padding: '0',
                background: '#001529',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
            }}>
                {/* Logo and brand name */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'white',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    padding: '0 24px'
                }}>
                    Admin Panel
                </div>

                {/* Main navigation menu */}
                <Menu
                    theme="dark"
                    mode="horizontal"
                    defaultSelectedKeys={['dashboard']}
                    style={{ flex: 1, minWidth: '200px' }}
                    items={menuItems}
                />

                {/* User dropdown menu */}
                <div style={{ padding: '0 24px' }}>
                    <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                        <Button type="text" style={{ color: 'white' }}>
                            <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                            {user?.name || 'User'}
                            <DownOutlined style={{ fontSize: '12px', marginLeft: 8 }} />
                        </Button>
                    </Dropdown>
                </div>
            </Header>

            <Content style={{ padding: '24px', background: '#f0f2f5' }}>
                <div style={{
                    padding: 24,
                    minHeight: 360,
                    background: '#fff',
                    borderRadius: '4px'
                }}>
                    <Outlet />
                </div>
            </Content>
        </Layout>
    );
};

export default NavBar;