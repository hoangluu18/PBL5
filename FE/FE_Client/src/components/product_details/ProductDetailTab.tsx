import { Table } from "antd";

const columns = [
    {
        dataIndex: "label",
        key: "label",
        render: (text: string) => <strong>{text}</strong>,
    },
    {
        dataIndex: "value",
        key: "value",
    },
];

const data = [
    { key: "1", label: "CHIP NAME", value: "Apple M1 chip" },
    { key: "2", label: "CPU CORE", value: "8 (4 performance and 4 efficiency)" },
    { key: "3", label: "GPU CORE", value: "7" },
    { key: "4", label: "NEURAL ENGINE", value: "16 cores" },
];

const ProductDetailTab = () => {
    return (
        <div className="w-100">
            <Table
                columns={columns}
                dataSource={data}
                pagination={false}
                showHeader={false}
                size="large"
            />
        </div>
    );
};

export default ProductDetailTab;