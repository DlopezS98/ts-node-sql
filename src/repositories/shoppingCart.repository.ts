import ShoppingCart from "@Database/models/ShoppingCart.model";
import IShoppingCartRequestDto from "@Shared/models/DTOs/requests/shoppingCart.dto";
import IShoppingCartResponseDto from "@Shared/models/DTOs/responses/shoppingCart.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ShoppingCartRepository {
    async create(data: IShoppingCartRequestDto, userId: number): Promise<TransactionResponse> {
        const exists = await this.verifyIfExists(data.product_detail_id);
        if(exists) return { success: false, message: "The product already exists in the cart, update instead!" }

        await ShoppingCart.query().insert({
            product_detail_id: data.product_detail_id,
            quantity: data.quantity,
            user_id: userId
        });

        return { success: true, message: "Product added succesfully in the cart!" }
    }

    async update(data: IShoppingCartRequestDto, userId: number): Promise<TransactionResponse> {
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

    async list(userId: number): Promise<IShoppingCartResponseDto[]> {
        const cart = await ShoppingCart.query()
                                        .select("sc.id as cart_id",
                                                "sc.user_id", "u.username",
                                                "sc.product_detail_id", 
                                                "c.name", "pd.name", 
                                                "pdt.price", "pdt.description", 
                                                "pdt.regular_price",
                                                "pdt.tax_rate", "sc.tax_rate as total_tax_rate",
                                                "pdt.attributes", "sc.quantity",
                                                "sc.sub_total", "sc.total", "sc.created_at", "sc.updated_at")
                                        .from("shopping_cart as sc")
                                        .join("users as u", "sc.user_id", "u.id")
                                        .join("product_details as pdt", "sc.product_detail_id", "pdt.id")
                                        .join("categories as c", "pdt.category_id", "c.id")
                                        .join("products as pd", "pdt.product_id", "pd.id")
                                        .where("sc.user_id", "=", userId)
                                        .where("sc.deleted", "<>", true);
        //@ts-ignore
        return cart as IShoppingCartResponseDto[];
    }

    async deleteItem(product_detail_id: number, userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
                                        .select("*")
                                        .where("product_detail_id", "=", product_detail_id)
                                        .where("user_id", "=", userId)
                                        .where("deleted", "=", false)
                                        .first();

        if(!cart) return { success: false, message: "The product doesn't exists!" };

        await cart.$query().update({
            product_detail_id: product_detail_id,
            deleted: true
        });

        return { success: true, message: "Product deleted successfully!" };
    }

    async deleteCart(userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
                                        .select("id")
                                        .where("user_id", "=", userId)

        if(cart.length === 0) return { success: false, message: "User doesn't have a cart with products" };

        await ShoppingCart.query().delete().where("user_id", "=", userId);

        return { success: true, message: "Cart deleted successfully!" };
    }
}