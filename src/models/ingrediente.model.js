import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Ingrediente = db.define('Ingrediente', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  costo_extra: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 },
  stock: { type: DataTypes.INTEGER, defaultValue: 0 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'ingredientes',
  timestamps: false
})
