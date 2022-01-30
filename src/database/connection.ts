import { Knex, knex } from "knex";
import { KnexConfig } from "../config/knexfile";
import { Model } from "objection";
import { ITables } from "./tables";

export default class PsqlConnection {
    private readonly db: Knex;

    constructor() {
        this.db = knex(KnexConfig.development);
    }

    public setUpDatabase() {
        Model.knex(this.db);
    }
}

export const knexQuery = <T>(table: keyof ITables) => knex(KnexConfig.development).from<T>(table);