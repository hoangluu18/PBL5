import { AddressInfoDto } from './AddressInfoDto';
import { ShippingRespondDto } from './ShippingRespondDto';
import CartItem from '../../CartItem';
export interface CheckoutInfoDto {
    addressInfoDto: AddressInfoDto;
    cartProductDtoList: CartItem[];
    shippingRespondDtoList: ShippingRespondDto[];
}