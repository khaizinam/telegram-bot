const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0
}).promise();

const TABLES = {
  MARKET_NOTIFY : {
    name : 'app_market_notify'
  },
  COIN_MARKET: {
    name : 'app_coinmarket'
  },
  USER: {
    name : 'app_users'
  }
}

// Xuất kết nối để sử dụng nơi khác
module.exports = {
  pool,
  TABLES
};