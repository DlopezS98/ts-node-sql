import { Model } from "objection";

export default class Users extends Model {
    static get tableName(): string { return "users" };
}