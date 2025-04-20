import axios from "../axios.customize";
import IProduct from '../models/dto/ProductDto';
import { IProductFullInfoDto } from "../models/dto/ProductFullInfoDto";
import IProductDetailDto from "../models/dto/ProductDetailDto";
import { ICategoryDto } from "../models/dto/CategoryDto";
import SearchResponse from "../models/bean/SearchResponse";

class ProductService {
    async getProducts(pageNum: number): Promise<IProduct[]> {

        let products: IProduct[] | PromiseLike<IProduct[]> = [];

        try {
            const response = await axios.get<IProduct[]>(`/p`, {
                params: { pageNum }
            });
            products = response.data;
        } catch (error) {
            console.error(error);
        }

        return products;
    }

    async getProductByAlias(alias: string): Promise<IProductFullInfoDto> {
        let productInfo: IProductFullInfoDto | PromiseLike<IProductFullInfoDto> = {} as IProductFullInfoDto;

        try {
            const response = await axios.get<IProductFullInfoDto>(`/p/${alias}`);
            productInfo = response.data;
        } catch (error) {
            console.error(error);
        }

        return productInfo;
    }

    async getProductDetail(id: number): Promise<IProductDetailDto> {
        let productDetail: IProductDetailDto | PromiseLike<IProductDetailDto> = {} as IProductDetailDto;
        try {
            const response = await axios.get<IProductDetailDto>(`/p/${id}/details`);
            productDetail = response.data;
        } catch (error) {
            console.error(error);
        }
        return productDetail;
    }

    async searchProducts(
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
            const params: Record<string, any> = {};
            if (minPrice !== undefined && minPrice > 0) params.minPrice = minPrice;
            if (maxPrice !== undefined && maxPrice > 0) params.maxPrice = maxPrice;
            if (brandIds && brandIds.length > 0) params.brandIds = brandIds.join(',');
            if (rating !== undefined && rating > 0) params.rating = rating;
            if (sortOption) params.sortOption = sortOption;
            if (keyword) params.keyword = keyword;
            if (page) params.page = page;
            const response = await axios.get<SearchResponse>(`/p/search`, { params });
            resResponse = response.data;
        } catch (error) {
            console.error(error);
        }

        return resResponse;
    }

    async getBreadcrumb(id: number): Promise<ICategoryDto[]> {
        let breadcrumb: ICategoryDto[] | PromiseLike<ICategoryDto[]> = [];
        try {
            const response = await axios.get<ICategoryDto[]>(`/p/${id}/breadcrumbs`);
            breadcrumb = response.data;
        } catch (error) {
            console.error(error);
        }
        return breadcrumb;
    }
}


export default ProductService;