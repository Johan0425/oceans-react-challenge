-- Remove psql-specific commands like \gexec and \c
-- The database 'oceans_restaurant' is already created by POSTGRES_DB environment variable in docker-compose.yml

-- 1. Create the database user 'admin' that the backend will use to connect
--    The password here MUST match the DB_PASSWORD in your .env file
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
      CREATE USER admin WITH PASSWORD 'your_actual_strong_password_here'; -- <--- IMPORTANT: Use the plain-text password from your .env
   END IF;
END
$do$;

-- 2. Grant privileges to the 'admin' user on the 'oceans_restaurant' database
GRANT ALL PRIVILEGES ON DATABASE oceans_restaurant TO admin;

-- Connect to the database for subsequent table creations
-- This is often implicitly handled by the Docker entrypoint after the DB is created,
-- but explicitly setting the search_path or using fully qualified names can help.
-- For simplicity, assume the entrypoint connects to POSTGRES_DB.

-- 3. Creating tables (your existing table definitions are good)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'waiter')) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- 4. Inserting a test admin user for the APPLICATION (this is correct for your app's user management)
--    The password here MUST be the bcrypt hashed version of 'admin' or whatever you choose
INSERT INTO users (username, password, role)
SELECT 'admin', '$2b$12$2pX8K9y4Z6m3N5q7R1s9U.v2W4X6Y8Z0A1B3C5D7E9F0G2H4I6J8K', 'admin'
ON CONFLICT (username) DO NOTHING;