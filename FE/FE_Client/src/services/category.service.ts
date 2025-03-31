import Category from '../models/dto/Category';
import axios from "axios";


const API_URL = 'http://localhost:8081/api/c';

class CategoryService {
    async getRootCategories(): Promise<Category[]> {

        let categories: Category[] | PromiseLike<Category[]> = [];

        try {
            const response = await axios.get<Category[]>(`${API_URL}`);
            categories = response.data;
        } catch (error) {
            console.error(error);
        }

        return categories;
    }
}


export default CategoryService;