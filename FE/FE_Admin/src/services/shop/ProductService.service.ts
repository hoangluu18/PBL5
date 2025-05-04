import axios from 'axios';
import { Product, ProductsResponse } from '../../models/Product';
import { ProductDetail } from '../../models/ProductDetail';
import { Brand } from '../../models/Brand';
import { Category } from '../../models/Category';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class ProductService {
    async setProductEnabled(id: number, arg1: boolean) {
        const response = await axios.patch(`${API_URL}/api/products/${id}/set-enabled`, { arg1 });
        return response.data;
    }
    public async getProducts(
        page: number = 0,
        size: number = 10,
        sort: string = 'lastUpdated',
        dir: string = 'desc',
        keyword?: string,
        minPrice?: number,
        maxPrice?: number,
        stockThreshold?: number,
        shopId: number = 1
    ): Promise<ProductsResponse> {
        let params: any = { page, size, sort, dir };

        if (keyword) params.keyword = keyword;
        if (minPrice !== undefined) params.minPrice = minPrice;
        if (maxPrice !== undefined) params.maxPrice = maxPrice;
        if (stockThreshold !== undefined) params.stockThreshold = stockThreshold;
        if (shopId) params.shopId = shopId; // Default to shopId 1
        const response = await axios.get(`${API_URL}/api/products`, { params });
        return response.data;
    }

    public async searchProducts(
        keyword: string,
        page: number = 0,
        size: number = 10,
        sort: string = 'lastUpdated',
        order: string = 'desc',
        shopId: number = 1
    ): Promise<ProductsResponse> {
        try {
            const response = await axios.get(`${API_URL}/api/products`, {
                params: {
                    keyword,
                    page,
                    size,
                    sort,
                    dir: order, // Backend expects 'dir' not 'order'
                    shopId
                }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    public async filterByPrice(minPrice: number, maxPrice: number, page: number, size: number,
        sortField: string, sortDir: string, shopId: number): Promise<ProductsResponse> {
        const response = await axios.get(`${API_URL}/api/products`, {
            params: {
                minPrice,
                maxPrice,
                page,
                size,
                sort: sortField,
                dir: sortDir,
                shopId
            }
        });
        return response.data;
    }

    async filterByStock(threshold: number, page: number, size: number,
        sortField: string, sortDir: string, shopId: number): Promise<ProductsResponse> {
        const response = await axios.get(`${API_URL}/api/products`, {
            params: {
                stockThreshold: threshold,
                page,
                size,
                sort: sortField,
                dir: sortDir,
                shopId
            }
        });
        return response.data;
    }

    async getProductById(id: number): Promise<Product> {
        const response = await axios.get(`${API_URL}/api/products/${id}`);
        return response.data;
    }

    async createProduct(product: Partial<Product>): Promise<Product> {
        const response = await axios.post(`${API_URL}/api/products`, product);
        return response.data;
    }

    async updateProduct(id: number, product: Partial<Product>): Promise<Product> {
        const response = await axios.put(`${API_URL}/api/products/${id}`, product);
        return response.data;
    }

    async deleteProduct(id: number): Promise<void> {
        await axios.delete(`${API_URL}/api/products/${id}`);
    }

    async getProductDetail(id: number): Promise<ProductDetail> {
        const response = await axios.get(`${API_URL}/api/products/${id}/detail`);
        return response.data;
    }

    async updateProductDetail(id: number, productDetail: ProductDetail): Promise<ProductDetail> {
        const response = await axios.put(`${API_URL}/api/products/${id}/detail`, productDetail);
        return response.data;
    }

    async uploadProductImage(productId: number, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axios.post(`${API_URL}/api/products/${productId}/image`, formData);
        return response.data.imageUrl;
    }

    async uploadVariantImage(productId: number, variantId: number, file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('variantId', variantId.toString());

        const response = await axios.post(`${API_URL}/api/products/${productId}/variant-image`, formData);
        return response.data.imageUrl;
    }

    async uploadEditorImage(file: File): Promise<string> {
        const formData = new FormData();
        formData.append('file', file);

        const token = localStorage.getItem('token');
        const headers = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await axios.post(`${API_URL}/api/products/image-upload`, formData, { headers });
        return response.data.imageUrl;
    }

    async createProductWithDetails(productDetail: ProductDetail): Promise<ProductDetail> {
        const response = await axios.post(`${API_URL}/api/products/create-with-details`, productDetail);
        return response.data;
    }


    async getAllBrands(): Promise<Brand[]> {
        try {
            const response = await axios.get(`${API_URL}/api/brands`);
            return response.data;
        } catch (error) {
            console.error("Error fetching brands:", error);
            return [];
        }
    }

    async getBrandsByCategory(categoryId: number): Promise<Brand[]> {
        try {
            const response = await axios.get(`${API_URL}/api/brands/by-category/${categoryId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching brands by category:", error);
            return [];
        }
    }

    async getAllCategories(): Promise<Category[]> {
        try {
            const response = await axios.get(`${API_URL}/api/categories`);
            return response.data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    }

    async getCategoriesByBrand(brandId: number): Promise<Category[]> {
        try {
            const response = await axios.get(`${API_URL}/api/categories/by-brand/${brandId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching categories by brand:", error);
            return [];
        }
    }

    async updateVariantImage(productId: number, variantId: number, imageUrl: string): Promise<any> {
        try {
            const response = await axios.put(
                `${API_URL}/products/${productId}/variants/${variantId}/image`, 
                { photo: imageUrl }
            );
            return response.data;
        } catch (error) {
            console.error('Error updating variant image:', error);
            throw error;
        }
    }



}