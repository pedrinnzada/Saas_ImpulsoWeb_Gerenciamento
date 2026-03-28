const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'dpg-d73h9pkg9agc738666tg-a',
  user: process.env.DB_USER || 'impulso_web_user',
  password: process.env.DB_PASSWORD || '4Eb9xSyX7Koxx6gRDHjIxUvGKKkfvuMk',
  database: process.env.DB_NAME || 'impulso_web',
  port: process.env.DB_PORT || 3306, // importante!
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;