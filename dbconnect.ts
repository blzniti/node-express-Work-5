import mysql from "mysql";
import util from "util";

export const conn = mysql.createPool(
    {
        connectionLimit: 10,
        host: "202.28.34.197",
        user: "web66_65011212178",
        password: "65011212178@csmsu",
        database: "web66_65011212178"
    }
); 

export const queryAsync = util.promisify(conn.query).bind(conn);

// conn.getConnection(function(err, connection) {
//     if (err) {
//         console.error("Error connecting to database:", err);
//     } else {
//         console.log("Database connected successfully!");
//         connection.release(); // ต้องคืน connection กลับเข้าสู่ pool เมื่อใช้เสร็จสิ้น
//     }
//   });
  