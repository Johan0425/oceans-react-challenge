import { Pool } from 'pg';
import dotenv from 'dotenv'; 
dotenv.config();

/**
 * Creates a new instance of a PostgreSQL connection pool using the `pg` library.
 * The connection pool is configured with environment variables for database credentials
 * and connection details.
 *
 * @constant
 * @type {Pool}
 * @property {string} user - The username for authenticating with the database, sourced from `process.env.DB_USER`.
 * @property {string} host - The hostname of the database server, sourced from `process.env.DB_HOST`.
 * @property {string} database - The name of the database to connect to, sourced from `process.env.DB_DATABASE`.
 * @property {string} password - The password for authenticating with the database, sourced from `process.env.DB_PASSWORD`.
 * @property {number} port - The port number on which the database server is running, sourced from `process.env.DB_PORT` or defaults to `5432`.
 */

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

pool.connect((err) => {
  if (err) {
    console.error('Initial database connection error:', {
      message: err.message,
      code: (err as any).code,
      password_status: process.env.DB_PASSWORD ? 'defined' : 'undefined',
    });
  } else {
    console.log('Database connected successfully');
  }
});

pool.on('error', (err, client) => {
  console.error('Pool error (unhandled client error):', {
    message: err.message,
    client: client ? 'active' : 'inactive',
  });
});

export default pool;

console.log('DB Config:', {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });