import { ICartDetailsDto } from "./cartDetails.dto";

export default interface IShoppingCartDto {
    cartId: number;
    cartDetails: ICartDetailsDto[];
}