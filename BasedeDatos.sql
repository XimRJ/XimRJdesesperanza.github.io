CREATE DATABASE desesperaza;
USE desesperaza;
CREATE TABLE inventario (
    PANID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100),
    urlimage VARCHAR(255),
    cantidad INT NOT NULL
);
INSERT INTO inventario (nombre, descripcion, precio, categoria, urlimage, cantidad) VALUES
('Pan de Muerto', 'Pan dulce tradicional mexicano, suave y esponjoso, con un toque de sabor a naranja y cubierto con azúcar. Ideal para recordar a los seres queridos en el Día de Muertos.', 15.00, 'Temporada', 'https://i.pinimg.com/564x/7b/37/69/7b3769685fe991b3265046c5c6955a66.jpg', 100),
('Donitas', 'Esponjosas donitas glaseadas con diferentes sabores, perfectas para un antojo dulce.', 20.00, 'Tradicional', 'https://i.pinimg.com/236x/66/75/fe/6675fe80cec7c9ae75aedeb53a20134d.jpg', 150),
('Chocolatin', 'Delicioso y hojaldrado, el chocolatin está relleno de una rica mezcla de chocolate oscuro y avellanas.', 20.00, 'Tradicional', 'https://i.pinimg.com/564x/36/c7/5f/36c75ffa8507cc0d30c1874c22f7ec4e.jpg', 100);

CREATE TABLE clientes (
    cliente_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    telefono VARCHAR(15),
    direccion VARCHAR(255)
);
CREATE TABLE categorias (
    categoria_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);
CREATE TABLE productos (
    producto_id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10, 2) NOT NULL,
    urlimage VARCHAR(255),
    categoria_id INT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(categoria_id) ON DELETE SET NULL
);
CREATE TABLE inventario (
    inventario_id INT AUTO_INCREMENT PRIMARY KEY,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE
);
CREATE TABLE pedidos (
    pedido_id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (cliente_id) REFERENCES clientes(cliente_id) ON DELETE SET NULL
);
CREATE TABLE detalles_pedidos (
    detalle_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(producto_id) ON DELETE CASCADE
);
CREATE TABLE facturas (
    factura_id INT AUTO_INCREMENT PRIMARY KEY,
    pedido_id INT NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(pedido_id) ON DELETE CASCADE
);
