
import React from "react";
import { Pagination, Table, Tag } from "antd";

// Sample order data
const ordersData = [
    { id: 2453, status: "SHIPPED", delivery: "Cash on delivery", date: "Dec 12, 12:56 PM", total: "$87", color: "green" },
    { id: 2452, status: "READY TO PICKUP", delivery: "Free shipping", date: "Dec 9, 2:28 PM", total: "$7264", color: "blue" },
    { id: 2451, status: "PARTIALLY FULFILLED", delivery: "Local pickup", date: "Dec 4, 12:56 PM", total: "$375", color: "orange" },
    { id: 2450, status: "CANCELED", delivery: "Standard shipping", date: "Dec 1, 4:07 AM", total: "$657", color: "red" },
    { id: 2449, status: "FULFILLED", delivery: "Express", date: "Nov 28, 7:28 PM", total: "$9562", color: "green" },
];

// Table columns
const columns = [
    { title: "ORDER", dataIndex: "id", key: "id", render: (text: string) => `#${text}` },
    { title: "STATUS", dataIndex: "status", key: "status", render: (status: string, record: any) => <Tag color={record.color}>{status}</Tag> },
    { title: "DELIVERY METHOD", dataIndex: "delivery", key: "delivery" },
    { title: "DATE", dataIndex: "date", key: "date" },
    { title: "TOTAL", dataIndex: "total", key: "total" },
];

// OrderList component
const OrderList: React.FC = () => {
    return (
        <div className="bg-white p-3">
            <Table dataSource={ordersData} columns={columns} rowKey="id" pagination={false} />
            <Pagination className="text-center mt-3" defaultCurrent={1} total={50} />
        </div>
    )
};

export default OrderList;
