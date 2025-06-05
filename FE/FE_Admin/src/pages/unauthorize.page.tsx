import React from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

const UnauthorizedPage: React.FC = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // This will navigate back to the previous page
    };

    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={
                <Button type="primary" onClick={handleGoBack}>
                    Go Back
                </Button>
            }
        />
    );
};

export default UnauthorizedPage;