import { Knex, knex } from "knex";
import { KnexConfig } from "../config/knexfile";
import { Model } from "objection";

export default class PsqlConnection {
    private readonly db: Knex;

    constructor() {
        this.db = knex(KnexConfig.development);
    }

    public setUpDatabase() {
        Model.knex(this.db);
    }
}