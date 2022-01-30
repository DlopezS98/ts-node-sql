import { config } from "dotenv";
// import { join } from 'path';

export default class Environment {
    constructor(){
        config();
    }

    public get PORT(): number {
        return Number(process.env.PORT) || 3000;
    }

    public get SERVER() : string {
        return process.env.SERVER_NAME || "DLOPEZS98";
    }

    public get USERNAME() : string {
        return process.env.PSQL_USERNAME || "postgres_username";
    }

    public get PASSWORD() : string {
        return process.env.PSQL_PASSWORD || "${Password}";
    }

    public get DATABASE(): string {
        return process.env.DATABASE_NAME || "dev_shopping_cart_db";
    }

    public get JWT_SECRET_KEY() : string {
        return process.env.JWT_SECRET_KEY || "MY_JWT_SECRET_KEY";
    }
}