import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Complemento = db.define('Complemento', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  precio: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  categoria: { type: DataTypes.STRING(50) },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'complementos',
  timestamps: false
})
