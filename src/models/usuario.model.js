import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'
import { Rol } from './rol.model.js'

export const Usuario = db.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(100), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  telefono: { type: DataTypes.STRING(20) },
  direccion: { type: DataTypes.STRING(255) },
  id_rol: { type: DataTypes.INTEGER, allowNull: false },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  activo: { type: DataTypes.BOOLEAN, defaultValue: true }
}, {
  tableName: 'usuarios',
  timestamps: false
})

Usuario.belongsTo(Rol, { foreignKey: 'id_rol', as: 'rol' })
