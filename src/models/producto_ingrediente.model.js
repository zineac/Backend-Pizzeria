import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const ProductoIngrediente = db.define('ProductoIngrediente', {
  id_producto: { type: DataTypes.INTEGER, primaryKey: true },
  id_ingrediente: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  tableName: 'producto_ingredientes',
  timestamps: false
})
