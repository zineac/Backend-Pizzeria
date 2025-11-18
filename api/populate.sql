USE pizzeria;

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
('Cancelado'),
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
INSERT INTO categorias (nombre, descripcion) VALUES
('Pizza', 'Pizzas artesanales personalizables'),
('Bebida', 'Refrescos, aguas y jugos'),
('Postre', 'Postres dulces y complementos'),
('Entradas', 'Aperitivos y entrantes para compartir'),
('Combos', 'Ofertas y combos familiares'),
('Extras', 'Añadidos y salsas');

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
