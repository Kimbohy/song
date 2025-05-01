import mysql from "mysql2/promise";

export async function createConnection() {
  return await mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "Teny123!",
    database: "music_db",
  });
}
