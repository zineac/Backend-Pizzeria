import { Producto } from './producto.model.js'
import { Ingrediente } from './ingrediente.model.js'
import { ProductoIngrediente } from './producto_ingrediente.model.js'

Producto.belongsToMany(Ingrediente, {
  through: ProductoIngrediente,
  foreignKey: 'id_producto',
  otherKey: 'id_ingrediente',
  as: 'ingredientes'
})

Ingrediente.belongsToMany(Producto, {
  through: ProductoIngrediente,
  foreignKey: 'id_ingrediente',
  otherKey: 'id_producto',
  as: 'productos'
})
