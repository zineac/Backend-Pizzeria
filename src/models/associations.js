// associations.js
import { Producto } from './producto.model.js'
import { Ingrediente } from './ingrediente.model.js'
import { ProductoIngrediente } from './producto_ingrediente.model.js'
import { Categoria } from './categoria.model.js'
import { DetallePedido } from './detalle_pedido.model.js'
import { Pedido } from './pedido.model.js'
import { EstadoPedido } from './estado_pedido.model.js'
import { MetodoPago } from './metodo_pago.model.js'
import { PedidoDetallePersonalizacion } from './pedido_detalle_personalizacion.model.js'
import { Tamano } from './tamano.model.js'
import { Usuario } from './usuario.model.js'
import { Rol } from './rol.model.js'

// 1. Productos e Ingredientes (muchos a muchos)
Producto.belongsToMany(Ingrediente, {
  through: ProductoIngrediente,
  foreignKey: 'id_producto',
  otherKey: 'id_ingrediente',
  as: 'ingredientes'
})
Ingrediente.belongsToMany(Producto, {
  through: ProductoIngrediente,
  foreignKey: 'id_ingrediente',
  otherKey: 'id_producto',
  as: 'productos'
})

// 2. Producto -> Categoria (muchos a uno)
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', as: 'categoria' })
Categoria.hasMany(Producto, { foreignKey: 'id_categoria', as: 'productos' })

// 3. DetallePedido -> Pedido y Producto
DetallePedido.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' })
Pedido.hasMany(DetallePedido, { foreignKey: 'id_pedido', as: 'detalles' })

DetallePedido.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' })
Producto.hasMany(DetallePedido, { foreignKey: 'id_producto', as: 'detalles' })

// 4. Pedido -> Usuario (cliente y repartidor), MetodoPago y EstadoPedido
Pedido.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' })
Usuario.hasMany(Pedido, { foreignKey: 'id_cliente', as: 'pedidosCliente' })

Pedido.belongsTo(Usuario, { foreignKey: 'id_repartidor', as: 'repartidor' })
Usuario.hasMany(Pedido, { foreignKey: 'id_repartidor', as: 'pedidosRepartidor' })

Pedido.belongsTo(MetodoPago, { foreignKey: 'id_metodo_pago', as: 'metodoPago' })
MetodoPago.hasMany(Pedido, { foreignKey: 'id_metodo_pago', as: 'pedidos' })

Pedido.belongsTo(EstadoPedido, { foreignKey: 'id_estado', as: 'estadoPedido' })
EstadoPedido.hasMany(Pedido, { foreignKey: 'id_estado', as: 'pedidos' })

// 5. PedidoDetallePersonalizacion -> DetallePedido, Tamano, Ingrediente
PedidoDetallePersonalizacion.belongsTo(DetallePedido, { foreignKey: 'id_detalle_pedido', as: 'detallePedido' })
DetallePedido.hasMany(PedidoDetallePersonalizacion, { foreignKey: 'id_detalle_pedido', as: 'personalizaciones' })

PedidoDetallePersonalizacion.belongsTo(Tamano, { foreignKey: 'id_tamano', as: 'tamano' })
Tamano.hasMany(PedidoDetallePersonalizacion, { foreignKey: 'id_tamano', as: 'personalizacionesTamano' })

PedidoDetallePersonalizacion.belongsTo(Ingrediente, { foreignKey: 'id_ingrediente', as: 'ingrediente' })
Ingrediente.hasMany(PedidoDetallePersonalizacion, { foreignKey: 'id_ingrediente', as: 'personalizacionesIngrediente' })

// 6. Usuario -> Rol
Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' })
Rol.hasMany(Usuario, { foreignKey: 'id_rol', as: 'usuarios' })
