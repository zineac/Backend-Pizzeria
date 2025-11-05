import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Tamano = db.define('Tamano', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  factor_precio: { type: DataTypes.DECIMAL(4, 2), defaultValue: 1.00 },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'tamanos',
  timestamps: false
})
