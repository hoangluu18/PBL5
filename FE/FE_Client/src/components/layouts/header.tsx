import { Layout, Input, Badge, Space } from "antd";
import { SearchOutlined, ShoppingCartOutlined, BellOutlined, UserOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import logo from '../../assets/logo.jpg'
import './style.css'
import HeaderMenu from "./menu";
import Category from "./category";


const { Header } = Layout;

const App = () => {
    return (
        <>
            <div className="primary-color">
                <div className="container">
                    <Header
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            background: "#F5F7FA",
                            padding: "10px 0px",
                        }}
                    >

                        {/* Logo */}
                        <div style={{ width: '100px', height: '100%' }}>
                            <img src={logo} alt="" style={{ width: '100%', height: '100%' }} />
                        </div>

                        {/* Search Bar */}
                        <Input
                            placeholder="Search"
                            prefix={<SearchOutlined />}
                            style={{
                                width: "50%",
                                borderRadius: "20px",
                                height: "80%",
                            }}
                        />

                        {/* Icons */}
                        <Space size={"middle"}>
                            <Badge count={3} color="blue">
                                <ShoppingCartOutlined style={{ fontSize: "20px" }} />
                            </Badge>
                            <Badge dot>
                                <BellOutlined style={{ fontSize: "20px" }} />
                            </Badge>
                            <UserOutlined style={{ fontSize: "20px" }} />
                        </Space>
                    </Header>
                </div>
            </div >
            <div>
                <div className="container">
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <Category />
                        <HeaderMenu />
                    </div>
                </div>
            </div>
        </>
    );
};

export default App;
