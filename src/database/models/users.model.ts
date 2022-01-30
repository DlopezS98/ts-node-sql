import { Model } from "objection";

export default class Users extends Model implements IUser {
    static get tableName(): string { return "users" };

    id!: number;
    email!: string;
    username!: string;
    password!: string;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;
}

export interface IUser {
    id: number;
    email: string;
    username: string;
    password: string;
    deleted: boolean;
    created_at: Date;
    updated_at: Date;
}