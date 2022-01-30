import { Model } from "objection";

export default class Products extends Model {
    static get tableName(): string { return "products" };
}