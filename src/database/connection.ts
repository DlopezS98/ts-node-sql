import sql, { config, ConnectionPool } from "mssql";
import Environment from "../config/environment";

export default class SqlConnection {

    private readonly databaseConfig: config;

    constructor() {
        const environment = new Environment();
        this.databaseConfig = {
            user: environment.USER,
            password: environment.PASSWORD,
            server: environment.SERVER,
            database: environment.DATABASE,
            options: {
                encrypt: true,
                trustServerCertificate: true
            }
        }
    }

    public get = async (): Promise<ConnectionPool> => await sql.connect(this.databaseConfig);;
}