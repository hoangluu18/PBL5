
import axios from "../axios.customize";

import ShopInfoDto from '../models/dto/detail_shop/ShopInfoDto'
import ProductDto from '../models/dto/ProductDto';


class ShopInfoService {
    async getShopInfo(shopId: number): Promise<ShopInfoDto> {
        try {
            const response = await axios.get(`/shop/${shopId}/shopInfo`);

            console.log('Shop info:', response.data);
            return response.data as ShopInfoDto;
        } catch (error) {
            console.error('Error fetching shop info:', error);
            throw error;
        }
    }

    async getProductByShopId(shopId: number, pageNum: number): Promise<ProductDto[]> {
        try {
            const response = await axios.get(`/shop/${shopId}/product?pageNum=${pageNum}`);
            console.log('Products:', response.data);
            return response.data as ProductDto[];
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    async checkIsFollowed(shopId: number, customerId: number): Promise<boolean> {
        try {
            const response = await axios.get(`/shop/${shopId}/checkIsFollowed`, {
                params: {
                    customerId: customerId
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
            const response = await axios.post(`/shop/${shopId}/follow`, null, {
                params: {
                    customerId: customerId
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
            const response = await axios.delete(`/shop/${shopId}/unfollow`, {
                params: {
                    customerId: customerId
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