import { Database, OPEN_READONLY, OPEN_READWRITE } from "duckdb-async";
import 'dotenv/config'

// loadEnv();

// //fix para corrigir bigInt para string
// (BigInt.prototype).toJSON = function() {
//     return this.toString();
// };

var DB;

async function initDB() {
    DB = await Database.create(process.env.DB_BITMAP, OPEN_READWRITE)
    console.log("Connected to database")
};

async function closeDB() {
    if (!DB) return;
    await DB.close();
    console.log("Closed database")
}

export { DB, initDB, closeDB}