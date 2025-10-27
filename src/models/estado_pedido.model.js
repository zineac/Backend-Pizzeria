import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const EstadoPedido = db.define('EstadoPedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false }
}, {
  tableName: 'estados_pedido',
  timestamps: false
})
