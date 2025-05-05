import { useEffect, useState } from 'react'
import axios from '../axios.customize'
import { Table, Spin } from 'antd'
import { Link } from 'react-router-dom'

const Customers = () => {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>('')

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('/saleperson/customers')
      setCustomers(response.data)
    } catch (error) {
      setError('Failed to fetch customers')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [])

  const columns = [
    {
      title: 'Mã khách hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khách hàng',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text: string, record: any) => (
        <Link to={`/customers/${record.id}`}>{text}</Link>
      ),
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Tổng chi tiêu',
      dataIndex: 'totalSpending',
      key: 'totalSpending',
      render: (value: number | null) => (value != null ? value.toLocaleString() : '0'),
    },
  ]

  if (loading) return <Spin size="large" />
  if (error) return <div>{error}</div>

  return (
    <div>
      <h1>Danh sách khách hàng</h1>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={customers}
        pagination={false}
        rowSelection={{ type: 'checkbox' }}
      />
    </div>
  )
}

export default Customers
