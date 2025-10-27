import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'
import { Pedido } from './pedido.model.js'
import { Complemento } from './complemento.model.js'

export const DetalleComplemento = db.define('DetalleComplemento', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_pedido: { type: DataTypes.INTEGER, allowNull: false },
  id_complemento: { type: DataTypes.INTEGER, allowNull: false },
  cantidad: { type: DataTypes.INTEGER, allowNull: false },
  precio_unitario: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  subtotal: {
    type: DataTypes.VIRTUAL,
    get () {
      return this.cantidad * this.precio_unitario
    }
  }
}, {
  tableName: 'detalle_complemento',
  timestamps: false
})

DetalleComplemento.belongsTo(Pedido, { foreignKey: 'id_pedido', as: 'pedido' })
DetalleComplemento.belongsTo(Complemento, { foreignKey: 'id_complemento', as: 'complemento' })
