import React, { useState, useEffect } from 'react';
import { DatePicker, Typography } from 'antd';
import dayjs from 'dayjs';
import ShopRevenueChart from './ShopRevenueChart';
import OrderRateChart from './OrderRateChart';

// Removed incorrect import

const DashBoardAdmin: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs>(dayjs());

    useEffect(() => {
    }, []);

    document.title = 'Trang quản trị - Dashboard';

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <Typography.Title level={2}>Admin Dashboard</Typography.Title>
                <div className="flex space-x-4">
                    <DatePicker
                        picker="month"
                        value={selectedDate}
                        onChange={(date) => setSelectedDate(date || dayjs())}
                        allowClear={false}
                        style={{ width: 140 }}
                    />
                </div>
            </div>

            <>
                <ShopRevenueChart
                    selectedDate={selectedDate}
                />

                <OrderRateChart selectedDate={selectedDate} />
            </>
        </div>
    );
};

export default DashBoardAdmin;