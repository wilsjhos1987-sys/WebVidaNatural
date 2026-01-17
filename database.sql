-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS vidanatural;
USE vidanatural;

-- Crear tabla de productos
CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    badges JSON -- Guardaremos los badges como formato JSON ["text", "text"]
);

-- Insertar datos iniciales (basados en tu products.js actual)
INSERT INTO products (name, category, price, image, description, badges) VALUES 
('Quemador Natural Premium', 'control-peso', 32.99, 'https://www.nutrimind.net/images/news/analisis_quemadores_grasa/2.png', 'Ayuda natural para acelerar el metabolismo y controlar el peso.', '["natural", "vegan"]'),

('Crema Facial de Árgan', 'piel', 28.50, 'https://images.pexels.com/photos/6663374/pexels-photo-6663374.jpeg?_gl=1*17vko3z*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjc4MjUkajU1JGwwJGgw', 'Hidratación profunda con aceite de argán orgánico.', '["organic", "vegan"]'),

('Aceite Esencial Lavanda', 'antiestres', 18.75, 'https://images.pexels.com/photos/17466173/pexels-photo-17466173.jpeg?_gl=1*4w0258*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjc3MzUkajU5JGwwJGgw', 'Calma la mente y promueve un sueño reparador.', '["organic"]'),

('Suplemento Omega-3 Algas', 'suplementos', 42.25, 'https://cloudinary.images-iherb.com/image/upload/f_auto,q_auto:eco/images/flo/flo61424/l/8.jpg', 'Ácidos grasos esenciales de origen vegetal.', '["vegan"]'),

('Té Verde Orgánico', 'control-peso', 15.99, 'https://images.pexels.com/photos/5946639/pexels-photo-5946639.jpeg?_gl=1*10fgp02*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjc2ODAkajQ3JGwwJGgw', 'Antioxidantes naturales para complementar tu dieta.', '["organic", "natural"]'),

('Jabón de Caléndula', 'piel', 12.50, 'https://images.pexels.com/photos/7500305/pexels-photo-7500305.jpeg?_gl=1*1jyyerm*_ga*NTI4MzE5MDcxLjE3NjgzNjYxMTc.*_ga_8JE65Q40S6*czE3NjgzNjYxMTckbzEkZzEkdDE3NjgzNjgyNTgkajU5JGwwJGgw', 'Suave limpieza para pieles sensibles.', '["organic", "natural", "vegan"]');

-- Tabla de Pedidos (Orders)
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'completed'
);

-- Tabla de Detalles del Pedido (Order Items)
CREATE TABLE IF NOT EXISTS order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);
