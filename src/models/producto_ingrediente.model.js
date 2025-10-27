import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'
import { Producto } from './producto.model.js'
import { Ingrediente } from './ingrediente.model.js'

export const ProductoIngrediente = db.define('ProductoIngrediente', {
  id_producto: { type: DataTypes.INTEGER, primaryKey: true },
  id_ingrediente: { type: DataTypes.INTEGER, primaryKey: true }
}, {
  tableName: 'producto_ingredientes',
  timestamps: false
})

ProductoIngrediente.belongsTo(Producto, { foreignKey: 'id_producto', as: 'producto' })
ProductoIngrediente.belongsTo(Ingrediente, { foreignKey: 'id_ingrediente', as: 'ingrediente' })
