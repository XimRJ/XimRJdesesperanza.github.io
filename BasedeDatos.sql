-- Drop database desesperaza;
CREATE DATABASE desesperaza;
USE desesperaza;

-- Tabla de clientes
CREATE TABLE IF NOT EXISTS cliente (
    id_cliente INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre_cliente VARCHAR(50) NOT NULL,
    correo_electronico_cliente VARCHAR(150) NOT NULL,
    password_cliente VARCHAR(255) NOT NULL -- Usar VARCHAR(255) para almacenar contraseñas encriptadas
);

-- Insertar datos de ejemplo en la tabla de clientes
INSERT INTO cliente(nombre_cliente, correo_electronico_cliente, password_cliente) VALUES
    ('Xim', 'xim@gmail.com', '1234'),
    ('Kriz', 'Kri@gmail.com', '5678');

-- Tabla de administradores
CREATE TABLE IF NOT EXISTS administrador (
    id_administrador INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    nombre_administrador VARCHAR(50) NOT NULL,
    correo_electronico_administrador VARCHAR(150) NOT NULL,
    password_administrador VARCHAR(255) NOT NULL -- Usar VARCHAR(255) para almacenar contraseñas encriptadas
);

-- Insertar datos de ejemplo en la tabla de administradores
INSERT INTO administrador(nombre_administrador, correo_electronico_administrador, password_administrador) VALUES
    ('root', 'root@gmail.com', 'root123');

-- Tabla de inventario
CREATE TABLE IF NOT EXISTS inventario (
    PANID INT AUTO_INCREMENT PRIMARY KEY,
    Nombre VARCHAR(255) NOT NULL,
    Descripcion TEXT,
    Precio DECIMAL(10, 2) NOT NULL,
    categoria VARCHAR(100),
    urlimage VARCHAR(255),
    cantidad INT NOT NULL
);

-- Insertar productos de ejemplo en el inventario
INSERT INTO inventario (nombre, descripcion, precio, categoria, urlimage, cantidad) VALUES
    ('Pan de Muerto', 'Pan dulce tradicional mexicano, suave y esponjoso, con un toque de sabor a naranja y cubierto con azúcar. Ideal para recordar a los seres queridos en el Día de Muertos.', 15.00, 'Temporada', 'https://i.pinimg.com/564x/7b/37/69/7b3769685fe991b3265046c5c6955a66.jpg', 100),
    ('Donitas', 'Esponjosas donitas glaseadas con diferentes sabores, perfectas para un antojo dulce.', 20.00, 'Tradicional', 'https://i.pinimg.com/236x/66/75/fe/6675fe80cec7c9ae75aedeb53a20134d.jpg', 150),
    ('Chocolatin', 'Delicioso y hojaldrado, el chocolatin está relleno de una rica mezcla de chocolate oscuro y avellanas.', 20.00, 'Tradicional', 'https://i.pinimg.com/564x/36/c7/5f/36c75ffa8507cc0d30c1874c22f7ec4e.jpg', 100);

-- Tabla del carrito (modificada para permitir múltiples productos por cliente)
CREATE TABLE IF NOT EXISTS carrito (
    id_cliente INT NOT NULL,
    pan_id INT NOT NULL,
    cantidad INT NOT NULL,
    PRIMARY KEY (id_cliente, pan_id),
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (pan_id) REFERENCES inventario(PANID)
);



