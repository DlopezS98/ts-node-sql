import { Model } from "objection";

export default class ShoppingCart extends Model implements IShoppingCart {
    static get tableName(): string { return "shopping_cart" };

    id!: number;
    product_detail_id!: number;
    user_id!: number;
    quantity!: number;
    total!: number;
    tax_rate?: number | undefined;
    total_price!: number;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

export interface IShoppingCart {
    id: number;
    product_detail_id: number;
    user_id: number;
    quantity: number;
    total: number;
    tax_rate?: number;
    total_price: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}