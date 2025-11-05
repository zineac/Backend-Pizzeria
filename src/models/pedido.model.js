import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Pedido = db.define('Pedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_cliente: { type: DataTypes.INTEGER, allowNull: false },
  id_repartidor: { type: DataTypes.INTEGER },
  id_metodo_pago: { type: DataTypes.INTEGER },
  estado: { type: DataTypes.INTEGER, defaultValue: 1 },
  fecha_pedido: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  total: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'pedidos',
  timestamps: false
})
