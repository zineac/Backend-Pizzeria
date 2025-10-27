import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'

export const MetodoPago = db.define('MetodoPago', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tipo: { type: DataTypes.STRING(50), allowNull: false },
  descripcion: { type: DataTypes.STRING(100) }
}, {
  tableName: 'metodos_pago',
  timestamps: false
})
