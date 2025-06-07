import React from "react";
import { Link } from "react-router-dom";
import '../css/style.css'
import { Row, Typography } from "antd";
import { ArrowRightOutlined } from "@ant-design/icons";


const { Title } = Typography;

interface SectionHeaderProps {
    title: string;
    icon?: string;
    linkText?: string;
    linkUrl?: string;
    color?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon, linkText, linkUrl, color }) => {

    return (
        <Row justify={"space-between"} align={"middle"}>
            <Title level={2} style={{ color: color }}>
                {title} {icon && <span className="ml-1">{icon}</span>}
            </Title>
            {/* {
                linkUrl && <Link className="text-primary underline" to={linkUrl}>{linkText} <ArrowRightOutlined /></Link>
            } */}

        </Row>

    );
};

export default SectionHeader;
