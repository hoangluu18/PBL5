import { Col, Layout, Row } from "antd";
import ActivityNotifications from "./ActivityNotification";
import MonthlyRevenueChart from "./MonthLyRevenueChart";
import SalesResults from "./SalesResult";
import TopProductsChart from "./TopProductChart";
import { Content } from "antd/es/layout/layout";



const Dashboard = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ padding: '24px', backgroundColor: '#f0f2f5' }}>
                <Row gutter={[24, 24]}>
                    {/* Sales Results - Top section */}
                    <Col xs={24}>
                        <SalesResults />
                    </Col>

                    {/* Main content area with charts and notifications */}
                    <Col xs={24}>
                        <Row gutter={[24, 24]}>
                            {/* Left side - Charts */}
                            <Col xs={24} lg={16}>
                                <Row gutter={[0, 24]}>
                                    {/* Monthly Revenue Chart */}
                                    <Col xs={24}>
                                        <MonthlyRevenueChart />
                                    </Col>

                                    {/* Top Products Chart */}
                                    <Col xs={24}>
                                        <TopProductsChart />
                                    </Col>
                                </Row>
                            </Col>

                            {/* Right side - Notifications */}
                            <Col xs={24} lg={8}>
                                <ActivityNotifications />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default Dashboard;




