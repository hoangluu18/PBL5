import { ICategoryDto } from "./CategoryDto";
import IProductDto from "./ProductDto";
import { IProductVariantDto } from "./ProductVariantDto";
import { IShopDto } from "./ShopDto";

export interface IProductFullInfoDto extends IProductDto {
    fullDescription: string;
    inStock: boolean;
    breadCrumbs: ICategoryDto[];
    images: string[];
    variantMap: Record<string, IProductVariantDto[]>;
    shopDto: IShopDto;
}