import { IBrandDto } from "../dto/BrandDto";
import { ICategoryDto } from "../dto/CategoryDto";
import IProductDto from "../dto/ProductDto";

export default interface SearchResponse {
    totalPages: number;
    totalElements: number;
    currentPage: number;

    products: IProductDto[];
    categories: ICategoryDto[];
    brands: IBrandDto[];

}