import { UnorderedListOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";

const Category = () => {
    const items: MenuProps["items"] = [
        {
            key: "2",
            label: "Sub menu",
            popupOffset: [5, 0],
            children: [
                {
                    key: "2-1",
                    label: "3rd menu item",
                    style: { width: "200px" },
                },
                {
                    key: "2-2",
                    label: "4th menu item",
                    style: { width: "200px" },
                    popupOffset: [5, 0],
                    children: [
                        {
                            key: "2-2-1",
                            label: "Sub menu",
                            style: { width: "200px" },
                        }
                    ],
                },
            ],
        }
    ];

    return (
        <Dropdown
            overlayStyle={{ width: "200px" }}
            menu={{ items }}
            placement="bottomLeft"
            arrow={{ pointAtCenter: true }}
            trigger={["hover"]}>
            <a onClick={(e) => e.preventDefault()}>
                <Space style={{ color: "black", cursor: "pointer" }}>
                    <UnorderedListOutlined />
                </Space>
            </a>
        </Dropdown>
    );
};

export default Category;
