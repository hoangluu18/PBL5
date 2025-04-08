const API_URL = 'http://localhost:8081/api';
import axios from 'axios';
import  IFollowingShopDto  from '../models/dto/FollowingShopDto';

// Hàm trợ giúp để tạo config với header xác thực
const getAuthConfig = () => {
    return {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
    };
};
class FollowingShopService {

    
    async getFollowingShops(pageNum: number, customerId: number): Promise<IFollowingShopDto[]> {
        try {
            const response = await axios.get(`${API_URL}/shop-tracking`, {
                params: {
                    customerId: customerId,
                    pageNum: pageNum
                },
                ...getAuthConfig()
            });
            console.log('Following shops:', response.data);
            return response.data as IFollowingShopDto[];
        } catch (error) {
            console.error('Error fetching following shops:', error);
            throw error;
        }
    }
}

export default FollowingShopService;