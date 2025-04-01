import  ShopDto  from '../ShopDto';
interface IShopInfoDto extends ShopDto {
    email: string;
    phone: string;
    description: string;
    address: string;
}
    
export default IShopInfoDto;