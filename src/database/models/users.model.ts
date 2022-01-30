import { Model, QueryContext } from "objection";
import { compare, genSalt, hash } from "bcrypt";

export default class Users extends Model implements IUser {
    static get tableName(): string { return "users" };

    id!: number;
    email!: string;
    username!: string;
    password!: string;
    deleted!: boolean;
    created_at!: Date;
    updated_at!: Date;

    public async $beforeInsert(queryContext: QueryContext): Promise<void> {
        const salt: string = await genSalt(10);
        this.password = await hash(this.password, salt);
    }

    public async matchPassword(password: string): Promise<boolean> {
        return await compare(password, this.password);
    }
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