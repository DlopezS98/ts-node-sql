import SqlConnection from "./database/connection";

const connection: SqlConnection = new SqlConnection();

async function main() {
    const pool = await connection.get();
    const result = await pool.query("SELECT CURRENT_TIMESTAMP AS DATE");
    console.log(result);
}

main();