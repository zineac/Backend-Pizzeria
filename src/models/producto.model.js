import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Producto = db.define('Producto', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  id_categoria: { type: DataTypes.INTEGER, allowNull: false },
  personalizable: { type: DataTypes.BOOLEAN, defaultValue: false },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'productos',
  timestamps: false
})
