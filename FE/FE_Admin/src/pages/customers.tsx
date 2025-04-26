import { useEffect, useState } from 'react';
import axios from '../axios.customize'; // Import axios instance
import { Table, Spin } from 'antd'; // Use Ant Design's Table and Spin components

const Customers = () => {
    const [customers, setCustomers] = useState<any[]>([]); // Store the list of customers
    const [loading, setLoading] = useState<boolean>(true); // Manage loading state
    const [error, setError] = useState<string>(''); // Manage error state

    // Function to fetch customers via API
    const fetchCustomers = async () => {
        try {
            const response = await axios.get('/saleperson/customers'); // Adjust endpoint as needed
            setCustomers(response.data);
        } catch (error) {
            setError('Failed to fetch customers');
            console.error('API Error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Use useEffect to fetch data when the component mounts
    useEffect(() => {
        fetchCustomers();
    }, []); // Run once on mount

    // Define table columns based on the UI in the image
    const columns = [
        {
            title: 'Mã khách hàng', // Customer ID
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Tên khách hàng', // Customer Name
            dataIndex: 'fullName',
            key: 'fullName',
        },
        {
            title: 'Điện thoại', // Phone
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: 'Tổng chi tiêu', // Total Spending
            dataIndex: 'totalSpending',
            key: 'totalSpending',
            render: (value: number | null) => (value != null ? value.toLocaleString() : '0'), // Handle null/undefined
        },
    ];

    if (loading) return <Spin size="large" />; // Show loading spinner while fetching data
    if (error) return <div>{error}</div>; // Show error message if fetch fails

    return (
        <div>
            <h1>Danh sách khách hàng</h1> {/* Customer List */}
            <Table
                rowKey="id" // Unique key for each row
                columns={columns} // Table columns defined above
                dataSource={customers} // Data to display in the table
                pagination={false} // Disable pagination for simplicity (optional)
                rowSelection={{ type: 'checkbox' }} // Add checkbox column as seen in the image
            />
        </div>
    );
};

export default Customers;