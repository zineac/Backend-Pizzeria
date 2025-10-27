import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'
import { Usuario } from './usuario.model.js'
import { MetodoPago } from './metodo_pago.model.js'
import { EstadoPedido } from './estado_pedido.model.js'

export const Pedido = db.define('Pedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_cliente: { type: DataTypes.INTEGER, allowNull: false },
  id_repartidor: { type: DataTypes.INTEGER },
  metodo_pago: { type: DataTypes.INTEGER },
  estado: { type: DataTypes.INTEGER, defaultValue: 1 },
  fecha_pedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
}, {
  tableName: 'pedidos',
  timestamps: false
})

Pedido.belongsTo(Usuario, { foreignKey: 'id_cliente', as: 'cliente' })
Pedido.belongsTo(Usuario, { foreignKey: 'id_repartidor', as: 'repartidor' })
Pedido.belongsTo(MetodoPago, { foreignKey: 'metodo_pago', as: 'metodoPago' })
Pedido.belongsTo(EstadoPedido, { foreignKey: 'estado', as: 'estadoPedido' })
