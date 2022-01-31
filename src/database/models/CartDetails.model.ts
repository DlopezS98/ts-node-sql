import { Model, ModelOptions, QueryContext } from "objection";
import ProductDetails from "./ProductDetails.model";

export default class CartDetails extends Model implements ICartDetails {
    static get tableName(): string { return "cart_details" };

    id!: number;
    cart_id!: number;
    product_detail_id!: number;
    quantity!: number;
    sub_total!: number;
    tax_rate?: number | undefined;
    total!: number;

    async $beforeInsert(queryContext: QueryContext): Promise<any> {
        await super.$beforeInsert(queryContext);
        const data = await ProductDetails.query(queryContext.transaction)
                                            .select("price", "tax_rate")
                                            .where("id", "=", this.product_detail_id)
                                            .where("deleted", "<>", true)
                                            .first();
        if(!data) throw new Error("The relationship doesn't exists between cart details & product details");

        this.sub_total = data.price * this.quantity;
        this.tax_rate = data.tax_rate ? (this.quantity * data.tax_rate) : undefined ;
        this.total = this.sub_total + (this.tax_rate ?? 0);
    }

    async $beforeUpdate(opt: ModelOptions, queryContext: QueryContext): Promise<any> {
        await super.$beforeUpdate(opt, queryContext);

        const data = await ProductDetails.query(queryContext.transaction)
                                            .select("price", "tax_rate")
                                            .where("id", "=", this.product_detail_id)
                                            .where("deleted", "<>", true)
                                            .first();
        if(!data) throw new Error("The relationship doesn't exists between cart details & product details");
        
        this.sub_total = data.price * this.quantity;
        this.tax_rate = data.tax_rate ? (this.quantity * data.tax_rate) : undefined ;
        this.total = this.sub_total + (this.tax_rate ?? 0);
    }
}

export interface ICartDetails {
    id: number;
    cart_id: number;
    product_detail_id: number;
    quantity: number;
    sub_total: number;
    tax_rate?: number;
    total: number;
}