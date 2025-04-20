import { useContext, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../components/context/auth.context';
import { Spin } from 'antd';

const OAuth2RedirectHandler = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { setCustomer } = useContext(AuthContext);

    useEffect(() => {
        // Get the URL parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        const userParam = params.get('user');
        const error = params.get('error');

        if (token && userParam) {
            try {
                // Decode user JSON
                const decodedUser = decodeURIComponent(userParam);
                const user = JSON.parse(decodedUser);
                
                // Store in localStorage
                localStorage.setItem('access_token', token);
                localStorage.setItem('customer', JSON.stringify({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                    phoneNumber: user.phoneNumber
                }));

                // Update context
                setCustomer({
                    id: user.id,
                    email: user.email,
                    username: user.username,
                    avatar: user.avatar,
                    phoneNumber: user.phoneNumber
                });

                // Redirect to home page
                navigate('/');
            } catch (err) {
                console.error('Error parsing user data', err);
                navigate('/login', { state: { error: 'Failed to process login data' } });
            }
        } else if (error) {
            navigate('/login', { state: { error } });
        } else {
            navigate('/login', { state: { error: 'Authentication failed' } });
        }
    }, [location, navigate, setCustomer]);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Spin size="large" tip="Processing login..." />
        </div>
    );
};

export default OAuth2RedirectHandler;