import axios from "axios";
import IProduct from '../models/dto/ProductDto';
import { IProductFullInfoDto } from "../models/dto/ProductFullInfoDto";
import IProductDetailDto from "../models/dto/ProductDetailDto";
import { ICategoryDto } from "../models/dto/CategoryDto";


const API_URL = 'http://localhost:8081/api/products';

class ProductService {
    async getProducts(pageNum: number): Promise<IProduct[]> {

        let products: IProduct[] | PromiseLike<IProduct[]> = [];

        try {
            const response = await axios.get<IProduct[]>(`${API_URL}`, {
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
            const response = await axios.get<IProductFullInfoDto>(`${API_URL}/p/${alias}`);
            productInfo = response.data;
        } catch (error) {
            console.error(error);
        }

        return productInfo;
    }

    async getProductDetail(id: number): Promise<IProductDetailDto> {
        let productDetail: IProductDetailDto | PromiseLike<IProductDetailDto> = {} as IProductDetailDto;
        try {
            const response = await axios.get<IProductDetailDto>(`${API_URL}/p/${id}/details`);
            productDetail = response.data;
        } catch (error) {
            console.error(error);
        }
        return productDetail;
    }

    async getBreadcrumb(id: number): Promise<ICategoryDto[]> {
        let breadcrumb: ICategoryDto[] | PromiseLike<ICategoryDto[]> = [];
        try {
            const response = await axios.get<ICategoryDto[]>(`${API_URL}/p/${id}/breadcrumbs`);
            breadcrumb = response.data;
        } catch (error) {
            console.error(error);
        }
        return breadcrumb;
    }
}


export default ProductService;