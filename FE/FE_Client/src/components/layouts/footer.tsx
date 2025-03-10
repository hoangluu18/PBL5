import { Col, Row } from 'antd';
import '../../css/style.css'
import logo from '../../assets/logo.jpg'
import { Link } from 'react-router-dom';
import { FacebookFilled, GoogleCircleFilled } from '@ant-design/icons';


const Footer = () => {
    return (
        <>
            <div className="bg-footer">
                <div className='container p-3'>
                    <Row gutter={[20, 0]}>
                        <Col span={8}>
                            <div style={{ width: "100px", height: "100px", marginBottom: "20px" }}>
                                <img src={logo} style={{ width: "100%", height: "100%", }} />
                            </div>
                            <div >
                                Phoenix is an admin dashboard template with fascinating features and amazing layout.
                            </div>
                        </Col>
                        <Col span={4}>
                            <div><h5>About Phoenix</h5></div>
                            <ul className='mt-2'>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>Career</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>Privacy policy</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/fa"}>Team & Conditions</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col span={4}>
                            <div><h5>Stay Connected</h5></div>
                            <ul className='mt-2'>
                                <li className='underline mb-1'>
                                    <Link to={"/"} className='underline mb-1'>Blogs</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>
                                        <FacebookFilled style={{ color: "blue", fontSize: "15px" }} />
                                        &nbsp;Facebook
                                    </Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>
                                        <GoogleCircleFilled style={{ color: "green", fontSize: "15px" }} />
                                        &nbsp;Facebook
                                    </Link>
                                </li>
                            </ul>
                        </Col>
                        <Col span={4}>
                            <div><h5>Customer Service</h5></div>
                            <ul className='mt-2'>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>Help desk</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>Support 24/7</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/fa"}>Community Of Phoneix</Link>
                                </li>
                            </ul>
                        </Col>
                        <Col span={4}>
                            <div><h5>Payment Method</h5></div>
                            <ul className='mt-2'>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>Cash on delivery</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/"}>Online payment</Link>
                                </li>
                                <li className='underline mb-1'>
                                    <Link to={"/fa"}>Paypal</Link>
                                </li>
                            </ul>
                        </Col>
                    </Row>
                </div>
            </div>
        </>
    )
}

export default Footer;
