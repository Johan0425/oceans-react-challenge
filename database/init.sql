-- Create the database if it doesn't exist
SELECT 'CREATE DATABASE oceans_restaurant' 
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'oceans_restaurant')\gexec

-- Connect to the oceans_restaurant database
\c oceans_restaurant

-- Creating users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('admin', 'waiter')) NOT NULL
);

-- Creating products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT
);

-- Creating orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) CHECK (status IN ('pending', 'completed', 'cancelled')) NOT NULL DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Creating order_items table
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Inserting a test admin user (password: 'admin' hashed using bcrypt)
INSERT INTO users (username, password, role) 
SELECT 'admin', '$2b$12$2pX8K9y4Z6m3N5q7R1s9U.v2W4X6Y8Z0A1B3C5D7E9F0G2H4I6J8K', 'admin'
ON CONFLICT (username) DO NOTHING;