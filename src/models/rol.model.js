import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Rol = db.define('Rol', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false }
}, {
  tableName: 'roles',
  timestamps: false
})
