import mysql from "mysql2/promise";

export async function createConnection() {
  return mysql.createConnection({
    host: "localhost",
    user: "henintsoa",
    password: "rahents",
    database: "music_db",
    port: 3306,
    namedPlaceholders: true,
  });
}
