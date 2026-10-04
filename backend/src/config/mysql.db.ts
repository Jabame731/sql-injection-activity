import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

let pool: mysql.Pool;

export const connection = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: "localhost",
      user: "root",
      password: process.env.DB_PASSWORD!,
      database: "activity",
      port: 3306,
      ssl: {
        rejectUnauthorized: false,
      },
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  return pool;
};
