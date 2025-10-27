import { db } from '../config/db.config.js'
import { DataTypes } from 'sequelize'
import { DetallePedido } from './detalle_pedido.model.js'
import { Tamano } from './tamano.model.js'
import { Ingrediente } from './ingrediente.model.js'

export const PedidoDetallePersonalizacion = db.define('PedidoDetallePersonalizacion', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  id_detalle_pedido: { type: DataTypes.INTEGER, allowNull: false },
  id_tamano: { type: DataTypes.INTEGER },
  id_ingrediente: { type: DataTypes.INTEGER },
  cantidad: { type: DataTypes.INTEGER, defaultValue: 1 },
  costo_extra: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0.00 }
}, {
  tableName: 'pedido_detalle_personalizacion',
  timestamps: false
})

PedidoDetallePersonalizacion.belongsTo(DetallePedido, { foreignKey: 'id_detalle_pedido', as: 'detallePedido' })
PedidoDetallePersonalizacion.belongsTo(Tamano, { foreignKey: 'id_tamano', as: 'tamano' })
PedidoDetallePersonalizacion.belongsTo(Ingrediente, { foreignKey: 'id_ingrediente', as: 'ingrediente' })
