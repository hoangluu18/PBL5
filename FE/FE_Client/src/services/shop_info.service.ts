
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
}


export default ShopInfoService;