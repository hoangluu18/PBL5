import axios from "../../axios.customize";
import { CategoryDto } from "../../models/Category";

class CategoryService {
    async getCategories(): Promise<CategoryDto[]> {
        try {
            const response = await axios.get('/admin/categories');
            return response.data.data || []; // Ensure an empty array is returned if data is undefined
        } catch (error) {
            console.error('Error fetching categories:', error);
            return []; // Return empty array on error
        }
    }

    async saveCategory(category: CategoryDto): Promise<CategoryDto> {
        try {
            const response = await axios.post('/admin/categories', category);
            return response.data.data;
        } catch (error) {
            console.error('Error creating category:', error);
            throw error; // Propagate the error
        }
    }

    async deleteCategory(id: number): Promise<void> {
        try {
            await axios.delete(`/admin/categories/${id}`);
        } catch (error) {
            console.error('Error deleting category:', error);
            throw error; // Propagate the error
        }
    }
}

export default CategoryService;