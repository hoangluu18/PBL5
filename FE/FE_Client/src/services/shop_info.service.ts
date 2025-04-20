
import axios from "axios";

import ShopInfoDto from '../models/dto/detail_shop/ShopInfoDto'
import ProductDto from '../models/dto/ProductDto';
const API_URL = 'http://localhost:8081/api';

class ShopInfoService {
    async getShopInfo(shopId: number): Promise<ShopInfoDto>{
        try {
            const response = await axios.get(`${API_URL}/shop/${shopId}/shopInfo`);
            
            console.log('Shop info:', response.data);
            return response.data as ShopInfoDto;
        } catch (error) {
            console.error('Error fetching shop info:', error);
            throw error;
        }
    }

    async getProductByShopId(shopId: number, pageNum: number): Promise<ProductDto[]>{
        try {
            const response = await axios.get(`${API_URL}/shop/${shopId}/product?pageNum=${pageNum}`);
            console.log('Products:', response.data);
            return response.data as ProductDto[];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async checkIsFollowed(shopId: number, customerId: number): Promise<boolean> {
        try {
            const response = await axios.get(`${API_URL}/shop/${shopId}/checkIsFollowed`, {
                params: {
                    customerId: customerId
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log('Follow status:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error checking follow status:', error);
            return false; // Default to false on error
        }
    }

    async followShop(shopId: number, customerId: number): Promise<boolean> {
        try {
            const response = await axios.post(`${API_URL}/shop/${shopId}/follow`, null, {
                params: {
                    customerId: customerId
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return true;
        } catch (error) {
            console.error('Error following shop:', error);
            return false;
        }
    }


    async unfollowShop(shopId: number, customerId: number): Promise<boolean> {
        try {
            const response = await axios.delete(`${API_URL}/shop/${shopId}/unfollow`, {
                params: {
                    customerId: customerId
                },
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                }
            });
            return true;
        } catch (error) {
            console.error('Error unfollowing shop:', error);
            return false;
        }
    }





}


export default ShopInfoService;