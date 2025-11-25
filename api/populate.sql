CREATE DATABASE pizzeria;
USE pizzeria;

-- ===========================================================
-- TABLA: roles
-- ===========================================================
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================================
-- TABLA: usuarios
-- ===========================================================
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    direccion VARCHAR(255),
    id_rol INT NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_rol) REFERENCES roles(id)
);

-- ===========================================================
-- TABLA: categorias  (ACTUALIZADA)
-- ===========================================================
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    imagen_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================================
-- TABLA: productos
-- ===========================================================
CREATE TABLE productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    id_categoria INT NOT NULL,
    personalizable BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    imagen_url VARCHAR(255),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id)
);

-- ===========================================================
-- TABLA: ingredientes
-- ===========================================================
CREATE TABLE ingredientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    costo_extra DECIMAL(10,2) DEFAULT 0.00,
    stock INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================================
-- TABLA INTERMEDIA: producto_ingredientes (Many-to-Many)
-- ===========================================================
CREATE TABLE producto_ingredientes (
    id_producto INT NOT NULL,
    id_ingrediente INT NOT NULL,
    PRIMARY KEY (id_producto, id_ingrediente),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id)
);

-- ===========================================================
-- TABLA: metodos_pago
-- ===========================================================
CREATE TABLE metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL,
    descripcion VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================================
-- TABLA: estados_pedido
-- ===========================================================
CREATE TABLE estados_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================================
-- TABLA: pedidos
-- ===========================================================
CREATE TABLE pedidos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_repartidor INT,
    id_metodo_pago INT,
    id_estado INT DEFAULT 1,
    fecha_pedido DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) DEFAULT 0.00,
    activo BOOLEAN DEFAULT TRUE,
    pedido_url VARCHAR(255),

    FOREIGN KEY (id_cliente) REFERENCES usuarios(id),
    FOREIGN KEY (id_repartidor) REFERENCES usuarios(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id),
    FOREIGN KEY (id_estado) REFERENCES estados_pedido(id)
);

-- ===========================================================
-- TABLA: detalle_pedido
-- ===========================================================
CREATE TABLE detalle_pedido (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_pedido INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,

    FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- ===========================================================
-- TABLA: tamanos
-- ===========================================================
CREATE TABLE tamanos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    factor_precio DECIMAL(4,2) DEFAULT 1.00,
    activo BOOLEAN DEFAULT TRUE
);

-- ===========================================================
-- TABLA: pedido_detalle_personalizacion
-- ===========================================================
CREATE TABLE pedido_detalle_personalizacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_detalle_pedido INT NOT NULL,
    id_tamano INT,
    id_ingrediente INT,
    cantidad INT DEFAULT 1,
    costo_extra DECIMAL(10,2) DEFAULT 0.00,

    FOREIGN KEY (id_detalle_pedido) REFERENCES detalle_pedido(id),
    FOREIGN KEY (id_tamano) REFERENCES tamanos(id),
    FOREIGN KEY (id_ingrediente) REFERENCES ingredientes(id)
);

-- =================================
-- Roles
-- =================================
INSERT INTO roles (nombre) VALUES
('cliente'),
('repartidor'),
('personal'),
('administrador');

-- =================================
-- Usuarios de ejemplo
-- =================================
INSERT INTO usuarios (nombre, email, password, telefono, direccion, id_rol, activo) VALUES
('Carlos Admin', 'admin@pizzeria.com', 'admin123', '555-111', 'Calle Central 123', 4, TRUE),
('Lucía López', 'lucia@example.com', 'cliente123', '555-222', 'Av. Las Flores 456', 1, TRUE),
('Pedro Repartidor', 'pedro@example.com', 'repartidor123', '555-333', 'Zona Norte 789', 2, TRUE),
('Ana Personal', 'ana@pizzeria.com', 'personal123', '555-444', 'Calle Secundaria 321', 3, TRUE);

-- =================================
-- Métodos de pago
-- =================================
INSERT INTO metodos_pago (tipo, descripcion) VALUES
('Efectivo', 'Pago en tienda o al repartidor'),
('Pasarela', 'Pago en línea');

-- =================================
-- Estados de pedido
-- =================================
INSERT INTO estados_pedido (nombre) VALUES
('Pendiente'),
('Pagado'),
('Preparando'),
('En camino'),
('Entregado'),
('Rechazado');

-- =================================
-- Tamaños de pizza
-- =================================
INSERT INTO tamanos (nombre, factor_precio) VALUES
('Individual', 1.00),
('Mediana', 1.20),
('Familiar', 1.50);

-- =================================
-- Categorías (existentes + nuevas)
-- =================================
INSERT INTO categorias (nombre, descripcion, imagen_url) VALUES
('Pizza', 'Pizzas artesanales personalizables',
 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Bebida', 'Refrescos, aguas y jugos',
 'https://images.pexels.com/photos/1410230/pexels-photo-1410230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Postre', 'Postres dulces y complementos',
 'https://images.pexels.com/photos/302680/pexels-photo-302680.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Entradas', 'Aperitivos y entrantes para compartir',
 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Combos', 'Ofertas y combos familiares',
 'https://images.pexels.com/photos/7651/food-plate-dinner-lunch.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Extras', 'Añadidos y salsas',
 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');

-- =================================
-- Ingredientes (existentes + nuevos)
-- =================================
INSERT INTO ingredientes (nombre, costo_extra, stock, activo) VALUES
('Queso Mozzarella', 0.50, 100, TRUE),
('Tomate', 0.30, 100, TRUE),
('Jamón', 0.80, 80, TRUE),
('Piña', 0.60, 70, TRUE),
('Pepperoni', 1.00, 90, TRUE),
('Champiñones', 0.70, 50, TRUE),
('Aceitunas', 0.50, 60, TRUE),
('Pollo', 1.20, 60, TRUE),
('Lechuga', 0.40, 80, TRUE),
('Salsa BBQ', 0.25, 200, TRUE),
('Extra Queso', 0.80, 150, TRUE);

-- =================================
-- Productos (solo pizzas personalizables = TRUE)
-- imagen_url apuntando a búsquedas de Pexels (imágenes libres)
-- =================================
INSERT INTO productos (nombre, descripcion, precio, id_categoria, personalizable, activo, imagen_url) VALUES
('Pizza Margarita', 'Clásica con queso mozzarella y tomate', 7.50, 1, TRUE, TRUE, 'https://images.pexels.com/photos/1166120/pexels-photo-1166120.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Pizza Hawaiana', 'Con jamón y piña', 8.50, 1, TRUE, TRUE, 'https://images.pexels.com/photos/1653841/pexels-photo-1653841.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Pizza Pepperoni', 'Clásica con extra pepperoni', 9.00, 1, TRUE, TRUE, 'https://images.pexels.com/photos/10790638/pexels-photo-10790638.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Refresco Coca-Cola', 'Bebida gaseosa 355ml', 1.50, 2, FALSE, TRUE, 'https://images.pexels.com/photos/1032127/pexels-photo-1032127.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Agua mineral', 'Botella 500ml', 1.00, 2, FALSE, TRUE, 'https://images.pexels.com/photos/13010776/pexels-photo-13010776.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Brownie', 'Postre de chocolate', 2.00, 3, FALSE, TRUE, 'https://images.pexels.com/photos/12473436/pexels-photo-12473436.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Alitas BBQ (6 piezas)', 'Alitas bañadas en salsa BBQ, crujientes', 5.50, 4, FALSE, TRUE, 'https://images.pexels.com/photos/6210876/pexels-photo-6210876.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Ensalada César', 'Lechuga, pollo a la plancha, croutons y aderezo César', 4.50, 4, FALSE, TRUE, 'https://images.pexels.com/photos/4553258/pexels-photo-4553258.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Combo Familiar (2 Pizzas + 4 Refrescos)', '2 pizzas medianas + 4 refrescos 355ml', 22.00, 5, FALSE, TRUE, 'https://images.pexels.com/photos/2147775/pexels-photo-2147775.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Extra Queso (porción)', 'Porción extra de queso para cualquier pizza', 0.80, 6, FALSE, TRUE, 'https://images.pexels.com/photos/10041473/pexels-photo-10041473.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Salsa BBQ (tarro 100ml)', 'Salsa BBQ casera para acompañar alitas o pizzas', 0.60, 6, FALSE, TRUE, 'https://images.pexels.com/photos/7751998/pexels-photo-7751998.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'),
('Pan de Ajo', 'Pan de ajo al horno, para compartir', 2.50, 4, FALSE, TRUE, 'https://images.pexels.com/photos/2034969/pexels-photo-2034969.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2');
-- =================================
-- Ingredientes base por producto (producto_ingredientes)
-- SOLO pizzas (respetando que solo ellas son personalizables)
-- Usando IDs directos porque la BD está vacía y los inserts fueron en este orden.
-- =================================

-- Pizza Margarita (producto id = 1)
INSERT INTO producto_ingredientes (id_producto, id_ingrediente) VALUES
(1, 1),
(1, 2);

-- Pizza Hawaiana (producto id = 2)
INSERT INTO producto_ingredientes (id_producto, id_ingrediente) VALUES
(2, 1),
(2, 3),
(2, 4);

-- Pizza Pepperoni (producto id = 3)
INSERT INTO producto_ingredientes (id_producto, id_ingrediente) VALUES
(3, 1),
(3, 2),
(3, 5);

-- =================================
-- Pedido de ejemplo (igual que tenías)
-- =================================
INSERT INTO pedidos (id_cliente, id_repartidor, id_metodo_pago, id_estado, total)
VALUES (2, 3, 1, 2, 20.00);

-- Detalle del pedido (asumo que detalle_pedido empieza en id 1)
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
VALUES 
(1, 1, 1, 7.50),  -- Pizza Margarita
(1, 3, 1, 9.00),  -- Pizza Pepperoni
(1, 4, 2, 1.50);  -- Refresco Coca-Cola

-- Personalización: pizza margarita con extra pepperoni
-- (id_detalle_pedido = 1, tamaño 'Mediana' corresponde a id 2, ingrediente 'Pepperoni' id 5)
INSERT INTO pedido_detalle_personalizacion (id_detalle_pedido, id_tamano, id_ingrediente, cantidad, costo_extra)
VALUES (1, 2, 5, 1, 1.00);