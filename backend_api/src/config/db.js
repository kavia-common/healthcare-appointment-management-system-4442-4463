'use strict';
/**
 * Database connection pool using environment variables for MySQL connectivity.
 * Requires env variables: MYSQL_URL or MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DB, MYSQL_PORT
 */
const mysql = require('mysql2/promise');

let pool;

/**
 * Initialize the MySQL pool singleton.
 * PUBLIC_INTERFACE
 */
async function initDb() {
  /** Initializes and returns a shared MySQL connection pool. */
  if (pool) return pool;

  const {
    MYSQL_URL,
    MYSQL_HOST,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
    MYSQL_PORT,
  } = process.env;

  // Build connection options
  let config;
  if (MYSQL_URL) {
    config = MYSQL_URL;
  } else {
    config = {
      host: MYSQL_HOST || 'localhost',
      user: MYSQL_USER || 'root',
      password: MYSQL_PASSWORD || '',
      database: MYSQL_DB || 'healthcare',
      port: MYSQL_PORT ? Number(MYSQL_PORT) : 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: 'Z',
    };
  }

  pool = mysql.createPool(config);
  return pool;
}

/**
 * Get pool instance (must call initDb once at startup)
 * PUBLIC_INTERFACE
 */
function getDb() {
  /** Returns the existing pool instance or throws if not initialized. */
  if (!pool) {
    throw new Error('Database pool not initialized. Call initDb() at startup.');
  }
  return pool;
}

module.exports = {
  initDb,
  getDb,
};
