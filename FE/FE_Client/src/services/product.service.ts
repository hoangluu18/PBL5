import axios from "axios";
import IProduct from '../models/Product';


const API_URL = 'http://localhost:8081/api/products';

class ProductService {
    async getProducts(): Promise<IProduct[]> {

        let products: IProduct[] | PromiseLike<IProduct[]> = [];

        try {
            const response = await axios.get<IProduct[]>(`${API_URL}`);
            products = response.data;
        } catch (error) {
            console.error(error);
        }

        return products;
    }
}


export default ProductService;