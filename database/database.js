const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost", // MySQL server hostname
  user: "root", // MySQL username
  password: "Defaultpw", // MySQL password
  database: "mysqlauth", // MySQL database name
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the database successfully.");
});

module.exports = connection;
