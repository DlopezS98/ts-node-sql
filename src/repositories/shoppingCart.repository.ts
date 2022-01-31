import ShoppingCart, { IShoppingCart } from "@Database/models/ShoppingCart.model";
import IShoppingCartDto from "@Shared/models/DTOs/requests/shoppingCart.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ShoppingCartRepository {
    async create(data: IShoppingCartDto, userId: number): Promise<TransactionResponse> {
        const exists = await this.verifyIfExists(data.product_detail_id);
        if(exists) return { success: false, message: "The product already exists in the cart, update instead!" }

        await ShoppingCart.query().insert({
            product_detail_id: data.product_detail_id,
            quantity: data.quantity,
            user_id: userId
        });

        return { success: true, message: "Product added succesfully in the cart!" }
    }

    async update(data: IShoppingCartDto, userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
                                        .select("*")
                                        .where("product_detail_id", "=", data.product_detail_id)
                                        .where("user_id", "=", userId)
                                        .where("deleted", "=", false)
                                        .first();
        if(!cart) return { success: false, message: "The product doesn't exists in the cart" };

        await cart.$query().update({
            product_detail_id: data.product_detail_id,
            quantity: data.quantity
        });

        return { success: true, message: "Cart updated successfully!" }
    }

    private async verifyIfExists(product_detail_id: number): Promise<boolean> {
        const cart = await ShoppingCart.query().select("id").where("product_detail_id", "=", product_detail_id).first();
        return cart ? true : false;
    }

    async list(userId: number): Promise<IShoppingCart[]> {
        const cart = await ShoppingCart.query().select("*").where("user_id", "=", userId).where("deleted", "<>", true);
        return cart;
    }
}