import { Model } from "objection";

export default class ShoppingCart extends Model implements IShoppingCart {
    static get tableName(): string { return "shopping_cart" };

    id!: number;
    user_id!: number;
    quantity!: number;
    total!: number;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

export interface IShoppingCart {
    id: number;
    user_id: number;
    quantity: number;
    total: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}