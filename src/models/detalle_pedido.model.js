import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const DetallePedido = db.define('DetallePedido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_pedido: { type: DataTypes.INTEGER, allowNull: false },
  id_producto: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.cantidad * this.precio_unitario
    }
  }
}, {
  tableName: 'detalle_pedido',
  timestamps: false
})
