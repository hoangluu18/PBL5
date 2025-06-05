import SearchResponse from '../models/bean/SearchResponse';
import Category from '../models/dto/Category';
import axios from "../axios.customize";
import { ICategoryDto } from '../models/dto/CategoryDto';

class CategoryService {
    async getRootCategories(): Promise<Category[]> {

        let categories: Category[] | PromiseLike<Category[]> = [];

        try {
            const response = await axios.get<Category[]>(`/c`);
            categories = response.data;
        } catch (error) {
            console.error(error);
        }

        return categories;
    }

    async getAllCategories(): Promise<Category[]> {
        let categories: Category[] | PromiseLike<Category[]> = [];
        try {
            const response = await axios.get<Category[]>(`/c/all`);
            categories = response.data;
        } catch (error) {
            console.error(error);
        }
        return categories;
    }

    async searchProductByCategory(
        alias: string,
        minPrice?: number,
        maxPrice?: number,
        brandIds?: number[],
        rating?: number,
        sortOption?: string,
        keyword?: string,
        page?: number
    ): Promise<SearchResponse> {
        let resResponse: SearchResponse | PromiseLike<SearchResponse> = {} as SearchResponse;

        try {
            // Dynamically construct params object
            const params: Record<string, any> = {};
            if (minPrice !== undefined && minPrice > 0) params.minPrice = minPrice;
            if (maxPrice !== undefined && maxPrice > 0) params.maxPrice = maxPrice;
            if (brandIds && brandIds.length > 0) params.brandIds = brandIds.join(',');
            if (rating !== undefined && rating > 0) params.rating = rating;
            if (sortOption) params.sortOption = sortOption;
            if (keyword) params.keyword = keyword;
            if (page) params.page = page;
            const response = await axios.get<SearchResponse>(`/c/${alias}`, { params });
            resResponse = response.data;
        } catch (error) {
            console.error(error);
        }

        return resResponse;
    }

    async getBreadcrumb(alias: string): Promise<ICategoryDto[]> {
        let breadcrumbs: ICategoryDto[] | PromiseLike<ICategoryDto[]> = [];

        try {
            const response = await axios.get<ICategoryDto[]>(`/c/${alias}/breadcrumbs`);
            breadcrumbs = response.data;
        } catch (error) {
            console.error(error);
        }

        return breadcrumbs;
    }
}


export default CategoryService;