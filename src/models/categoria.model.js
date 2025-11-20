import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const Categoria = db.define('Categoria', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(50), allowNull: false },
  descripcion: { type: DataTypes.TEXT },
  imagen_url: { type: DataTypes.STRING(255) },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'categorias',
  timestamps: false
})
