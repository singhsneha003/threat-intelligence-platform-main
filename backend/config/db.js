import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = await mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "threat_intelligence",
});


export default pool;
