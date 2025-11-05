import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const PedidoDetallePersonalizacion = db.define('PedidoDetallePersonalizacion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_detalle_pedido: { type: DataTypes.INTEGER, allowNull: false },
  id_tamano: { type: DataTypes.INTEGER },
  id_ingrediente: { type: DataTypes.INTEGER },
  cantidad: { type: DataTypes.INTEGER, defaultValue: 1 },
  costo_extra: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
}, {
  tableName: 'pedido_detalle_personalizacion',
  timestamps: false
})
