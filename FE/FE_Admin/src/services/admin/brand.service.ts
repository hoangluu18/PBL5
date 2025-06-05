import axios from "../../axios.customize";
import { Brand } from "../../models/Brand";

class BrandService {

    async getBrands(): Promise<Brand[]> {
        try {
            const response = await axios.get('/brands');
            return response.data || []; // Ensure an empty array is returned if data is undefined
        } catch (error) {
            console.error('Error fetching brands:', error);
            return []; // Return empty array on error
        }
    }

    async deleteBrand(id: number): Promise<void> {
        try {
            await axios.delete(`/brands/${id}`);
        } catch (error) {
            console.error('Error deleting brand:', error);
            throw error; // Rethrow the error for further handling if needed
        }
    }

    async updateBrand(id: number, name: string, logo: string): Promise<Brand> {
        try {
            // Set the correct content type for multipart/form-data (axios will set this automatically)
            const response = await axios.put(`/brands/${id}`, {
                name,
                logo: logo ? logo : null // Send the file if it exists
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error updating brand:', error);
            throw error; // Rethrow the error for further handling if needed
        }
    }

    // Update this method in BrandService
    async createBrand(name: string, logoFile: string): Promise<Brand> {
        try {
            const response = await axios.post('/brands', {
                name,
                logo: logoFile ? logoFile : null // Send the file if it exists
            }, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data;
        } catch (error) {
            console.error('Error creating brand:', error);
            throw error;
        }
    }

}

export default BrandService;