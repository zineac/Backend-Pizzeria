USE pizzeria;

-- =================================
-- Roles
-- =================================
INSERT INTO roles (nombre) VALUES
('cliente'),
('repartidor'),
('personal'),
('administrador')

-- =================================
-- Usuarios de ejemplo
-- =================================
INSERT INTO usuarios (nombre, email, password, telefono, direccion, id_rol, activo) VALUES
('Carlos Admin', 'admin@pizzeria.com', 'admin123', '555-111', 'Calle Central 123', 4, true),
('Lucía López', 'lucia@example.com', 'cliente123', '555-222', 'Av. Las Flores 456', 1, true),
('Pedro Repartidor', 'pedro@example.com', 'repartidor123', '555-333', 'Zona Norte 789', 2, true),
('Ana Personal', 'ana@pizzeria.com', 'personal123', '555-444', 'Calle Secundaria 321', 3, true);

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
('Preparando'),
('En camino'),
('Entregado'),
('Cancelado');

-- =================================
-- Tamaños de pizza
-- =================================
INSERT INTO tamanos (nombre, factor_precio) VALUES
('Individual', 1.00),
('Mediana', 1.20),
('Familiar', 1.50);

-- =================================
-- Ingredientes
-- =================================
INSERT INTO ingredientes (nombre, costo_extra, stock, activo) VALUES
('Queso Mozzarella', 0.50, 100, TRUE),
('Tomate', 0.30, 100, TRUE),
('Jamón', 0.80, 80, TRUE),
('Piña', 0.60, 70, TRUE),
('Pepperoni', 1.00, 90, TRUE),
('Champiñones', 0.70, 50, TRUE),
('Aceitunas', 0.50, 60, TRUE);

-- =================================
-- Productos (pizzas base)
-- =================================
INSERT INTO productos (nombre, descripcion, precio, activo) VALUES
('Pizza Margarita', 'Clásica con queso mozzarella y tomate', 7.50, TRUE),
('Pizza Hawaiana', 'Con jamón y piña', 8.50, TRUE),
('Pizza Pepperoni', 'Clásica con extra pepperoni', 9.00, TRUE);

-- =================================
-- Ingredientes base por producto
-- =================================
-- Margarita
INSERT INTO producto_ingredientes (id_producto, id_ingrediente) VALUES
(1, 1),
(1, 2);

-- Hawaiana
INSERT INTO producto_ingredientes (id_producto, id_ingrediente) VALUES
(2, 1),
(2, 3),
(2, 4);

-- Pepperoni
INSERT INTO producto_ingredientes (id_producto, id_ingrediente) VALUES
(3, 1),
(3, 2),
(3, 5);

-- =================================
-- Complementos
-- =================================
INSERT INTO complementos (nombre, descripcion, precio, stock, categoria, activo) VALUES
('Refresco Coca-Cola', 'Bebida gaseosa 355ml', 1.50, 100, 'Bebida', TRUE),
('Brownie', 'Postre de chocolate', 2.00, 40, 'Postre', TRUE),
('Agua mineral', 'Botella 500ml', 1.00, 80, 'Bebida', TRUE);

-- =================================
-- Pedido de ejemplo
-- =================================
INSERT INTO pedidos (id_cliente, id_repartidor, metodo_pago, estado, total)
VALUES (2, 3, 1, 2, 20.00);

-- Detalle del pedido
INSERT INTO detalle_pedido (id_pedido, id_producto, cantidad, precio_unitario)
VALUES (1, 1, 1, 7.50),
       (1, 3, 1, 9.00);

-- Personalización: pizza margarita con extra pepperoni
INSERT INTO pedido_detalle_personalizacion (id_detalle_pedido, id_tamano, id_ingrediente, cantidad, costo_extra)
VALUES (1, 2, 5, 1, 1.00);

-- Complemento en el pedido
INSERT INTO detalle_complemento (id_pedido, id_complemento, cantidad, precio_unitario)
VALUES (1, 1, 2, 1.50);
