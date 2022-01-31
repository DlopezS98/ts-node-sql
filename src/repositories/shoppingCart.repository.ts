import CartDetails from "@Database/models/CartDetails.model";
import ShoppingCart from "@Database/models/ShoppingCart.model";
import { ICartDetailsDto } from "@Shared/models/DTOs/requests/cartDetails.dto";
import IShoppingCartRequestDto from "@Shared/models/DTOs/requests/shoppingCart.dto";
import { IShoppingCartDto as IShoppingCartResponseDto, IRawShoppingCartDto } from "@Shared/models/DTOs/responses/shoppingCart.dto";
import { TransactionResponse } from "@Shared/types/common";

export default class ShoppingCartRepository {
    async create(data: IShoppingCartRequestDto, userId: number): Promise<TransactionResponse> {
        const hasCart = await this.userHasCart(userId);
        if(hasCart[0]) { 
            data.cartId = hasCart[1] as number; 
            const resp = await this.updateCart(data, userId);
            return resp;
        }

        const cart = await ShoppingCart.query().insert({
            user_id: userId,
            quantity: 0,
            total: 0,          
        });

        data.cartDetails.forEach(async(dt) => {
            await this.createCartDetail(dt, cart.id);
        });

        await this.calculateCartTotals(cart.id, userId);
        return { success: true, message: "Product added succesfully in the cart!" }
    }

    async updateCart(data: IShoppingCartRequestDto, userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
                                        .select("id")
                                        .where("id", "=", data.cartId)
                                        .where("user_id", "=", userId)
                                        .where("deleted", "=", false)
                                        .first();
        if(!cart) return { success: false, message: "The cart doesn't exists" };

        if(data.cartDetails.length > 0)
            data.cartDetails.forEach(async(dt) => {
                const exists = await this.cartDetailExists(dt.product_detail_id, cart.id);
                if(!exists)
                    await this.createCartDetail(dt, cart.id);
                else
                    await this.updateCartDetail(dt, cart.id);
            });

        await this.calculateCartTotals(cart.id, userId);
        
        return { success: true, message: "Cart updated successfully!" }
    }

    private async updateCartDetail(cartDetail: ICartDetailsDto, cartId: number) {
        await CartDetails.query().update({ product_detail_id: cartDetail.product_detail_id, quantity: cartDetail.quantity })
                                    .where("cart_id", "=", cartId)
                                    .where("product_detail_id", "=", cartDetail.product_detail_id);
    }

    private async calculateCartTotals(cartId: number, userId: number) {
        const data = await CartDetails.query()
                                    .select("total")
                                    .where("cart_id", "=", cartId);
        const quantity = data.length;
        const total = quantity > 0 
                    ? (data.map(x => Number(x.total))).reduce((prev, act) => (prev + act), 0)
                    : 0;

        await ShoppingCart.query().update({ quantity, total, updated_at: new Date() })
                                        .where("deleted", "=", false)
                                        .where("user_id", "=", userId)
    }

    private async createCartDetail(cartDetail: ICartDetailsDto, cartId: number) {
        const dt = await CartDetails.query().insert({
            cart_id: cartId,
            product_detail_id: cartDetail.product_detail_id,
            quantity: cartDetail.quantity
        });

        return dt;
    }

    private async cartDetailExists(product_detail_id: number, cartId: number): Promise<boolean> {
        const cart = await CartDetails.query().select("id")
                                                .where("product_detail_id", "=", product_detail_id)
                                                .where("cart_id", "=", cartId)
                                                .first();
        return cart ? true : false;
    }

    private async userHasCart(userId: number): Promise<[boolean, number | undefined]> {
        const cart = await ShoppingCart.query().select("id").where("user_id", "=", userId).where("deleted", "=", false).first();
        return [cart ? true : false, cart?.id];
    }

    async list(userId: number): Promise<IShoppingCartResponseDto | Partial<IShoppingCartResponseDto>> {
        const cart = await ShoppingCart.query()
                                        .select("sc.id as cart_id",
                                                "sc.user_id", "u.username",
                                                "cd.product_detail_id", 
                                                "c.name", "pd.name", 
                                                "pdt.price", "pdt.description", 
                                                "pdt.regular_price",
                                                "pdt.tax_rate", "sc.quantity as total_quantity",
                                                "pdt.attributes", "cd.quantity", "sc.total as total_to_pay",
                                                "cd.sub_total", "cd.total", "sc.created_at", "sc.updated_at")
                                        .from("shopping_cart as sc")
                                        .join("users as u", "sc.user_id", "u.id")
                                        .join("cart_details as cd", "sc.id", "cd.cart_id")
                                        .join("product_details as pdt", "cd.product_detail_id", "pdt.id")
                                        .join("categories as c", "pdt.category_id", "c.id")
                                        .join("products as pd", "pdt.product_id", "pd.id")
                                        .where("sc.user_id", "=", userId)
                                        .where("sc.deleted", "<>", true);
        //@ts-ignore
        const data = this.mapCartList(cart as IShoppingCartResponseDto[]);
        return data;
    }

    async deleteProduct(product_detail_id: number, userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query().select("*").where("user_id", "=", userId).first();
        if(!cart) return { success: false, message: "The user doesn't have a cart" };
        const detail = await CartDetails.query()
                                        .select("*")
                                        .where("product_detail_id", "=", Number(product_detail_id))
                                        .where("cart_id", "=", cart.id)
                                        .first();

        if(!detail) return { success: false, message: "The product doesn't exists!" };

        await detail.$query().delete();
        await this.calculateCartTotals(cart.id, userId);

        return { success: true, message: "Product deleted successfully!" };
    }

    async deleteCart(userId: number): Promise<TransactionResponse> {
        const cart = await ShoppingCart.query()
                                        .select("id")
                                        .where("user_id", "=", userId)
                                        .where("deleted", "=", false).first();

        if(!cart) return { success: false, message: "User doesn't have a cart with products" };

        await CartDetails.query().delete().where("cart_id", "=", cart.id);
        await this.calculateCartTotals(cart.id, userId);
        return { success: true, message: "Cart deleted successfully!" };
    }

    private mapCartList(data: IRawShoppingCartDto[]): IShoppingCartResponseDto | Partial<IShoppingCartResponseDto> {
        if(data.length === 0) return {};

        const products = data.map(x => (
            {
                product_detail_id: x.product_detail_id,
                name: x.name,
                price: x.price,
                description: x.description,
                regular_price: x.regular_price,
                tax_rate: x.tax_rate,
                attributes: x.attributes,
                quantity: x.quantity,
                sub_total: x.sub_total,
                total: x.total
            }
        ));

        const cart = data[0];

        return {
            cart_id: cart.cart_id,
            user_id: cart.user_id,
            username: cart.username,
            products,
            total_quantity: cart.total_quantity,
            total_to_pay: cart.total_to_pay,
            created_at: cart.created_at,
            updated_at: cart.updated_at
        }
    }
}