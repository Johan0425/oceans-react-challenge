-- The database 'oceans_restaurant' is created by POSTGRES_DB in docker-compose.yml

-- 1. Create the database user 'admin' with a password matching .env
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'admin') THEN
      CREATE USER admin WITH PASSWORD 'securePassRestaurant223140'; -- Match DB_PASSWORD from .env
   END IF;
END
$do$;

-- 2. Grant privileges to 'admin' on the 'oceans_restaurant' database
GRANT ALL PRIVILEGES ON DATABASE oceans_restaurant TO admin;

-- 3. Create tables
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'waiter')) NOT NULL DEFAULT 'waiter'
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price_at_time DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
);

-- 4. Insert a test admin user with a bcrypt-hashed password
-- Using a bcrypt hash for 'admin123' 
INSERT INTO users (username, password, role)
SELECT 'admin', '$2b$12$QjSH496pQ/9Nq5G6x0T9T.e6W9x0Q2pX8K9y4Z6m3N5q7R1s9U.v2', 'admin'
ON CONFLICT (username) DO NOTHING;