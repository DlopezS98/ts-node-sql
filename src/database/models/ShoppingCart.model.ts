import { Model, ModelOptions, QueryContext } from "objection";
import ProductDetails from "./ProductDetails.model";

export default class ShoppingCart extends Model implements IShoppingCart {
    static get tableName(): string { return "shopping_cart" };

    id!: number;
    product_detail_id!: number;
    user_id!: number;
    quantity!: number;
    sub_total!: number;
    tax_rate?: number | undefined;
    total!: number;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;

    async $beforeInsert(queryContext: QueryContext): Promise<any> {
        const data = await ProductDetails.query(queryContext.transaction)
                                            .select("price", "tax_rate")
                                            .where("id", "=", this.product_detail_id)
                                            .where("deleted", "<>", true)
                                            .first();
        if(!data) throw new Error("The relationship doesn't exists between shooping cart & product details");

        this.sub_total = data.price * this.quantity;
        this.tax_rate = data.tax_rate ? (this.quantity * data.tax_rate) : undefined ;
        this.total = this.sub_total + (this.tax_rate ?? 0);
    }

    async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<any> {
        await super.$beforeUpdate(opt, queryContext);

        this.updated_at = new Date();
        const deleting = this.deleted ?? false;
        if(deleting) return;

        const data = await ProductDetails.query(queryContext.transaction)
                                            .select("price", "tax_rate")
                                            .where("id", "=", this.product_detail_id)
                                            .where("deleted", "<>", true)
                                            .first();
        if(!data) throw new Error("The relationship doesn't exists between shooping cart & product details");
        
        this.sub_total = data.price * this.quantity;
        this.tax_rate = data.tax_rate ? (this.quantity * data.tax_rate) : undefined ;
        this.total = this.sub_total + (this.tax_rate ?? 0);
    }
}

export interface IShoppingCart {
    id: number;
    product_detail_id: number;
    user_id: number;
    quantity: number;
    sub_total: number;
    tax_rate?: number;
    total: number;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}