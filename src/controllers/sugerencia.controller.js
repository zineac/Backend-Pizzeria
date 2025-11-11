import { Producto } from '../models/producto.model.js'
import { Categoria } from '../models/categoria.model.js'
import { Ingrediente } from '../models/ingrediente.model.js'
import { Tamano } from '../models/tamano.model.js'
import { Pedido } from '../models/pedido.model.js'
import { DetallePedido } from '../models/detalle_pedido.model.js'
import { PedidoDetallePersonalizacion } from '../models/pedido_detalle_personalizacion.model.js'
import { Op, Sequelize } from 'sequelize'
import { calcularPrecioReal } from './producto.controller.js'

const { fn, col, literal } = Sequelize

export const getSugerencias = async (req, res) => {
  try {
    const idCliente = req.user.id
    const pedidos = await Pedido.findAll({
      where: { id_cliente: idCliente },
      include: {
        model: DetallePedido,
        as: 'detalles',
        include: [
          { model: Producto, as: 'producto', include: [{ model: Categoria, as: 'categoria' }] },
          {
            model: PedidoDetallePersonalizacion,
            as: 'personalizaciones',
            include: [{ model: Ingrediente, as: 'ingrediente' }, { model: Tamano, as: 'tamano' }]
          }
        ]
      }
    })

    if (!pedidos.length) {
      const populares = await DetallePedido.findAll({
        attributes: ['id_producto', [fn('COUNT', col('id_producto')), 'veces']],
        group: ['id_producto'],
        order: [[literal('veces'), 'DESC']],
        limit: 5,
        include: [{ model: Producto, as: 'producto', where: { activo: true }, include: [{ model: Categoria, as: 'categoria' }] }]
      })

      const sugerencias = populares.map(p => {
        const prod = p.producto.toJSON()
        prod.precioReal = calcularPrecioReal(prod)
        return prod
      })

      return res.json({ tipo: 'populares', sugerencias })
    }

    const contador = {}
    const categorias = new Set()
    const ingredientesUsados = {}
    const tamanosUsados = {}
    const combinaciones = {}

    pedidos.forEach(p => {
      p.detalles.forEach(d => {
        contador[d.id_producto] = (contador[d.id_producto] || 0) + d.cantidad
        if (d.producto?.categoria?.id) categorias.add(d.producto.categoria.id)
        d.personalizaciones?.forEach(pers => {
          if (pers.id_ingrediente) ingredientesUsados[pers.id_ingrediente] = (ingredientesUsados[pers.id_ingrediente] || 0) + 1
          if (pers.id_tamano) tamanosUsados[pers.id_tamano] = (tamanosUsados[pers.id_tamano] || 0) + 1
        })
        const claveComb = d.personalizaciones?.map(p => `${p.id_ingrediente || 0}-${p.id_tamano || 0}`).sort().join('|') || 'base'
        combinaciones[claveComb] = (combinaciones[claveComb] || 0) + 1
      })
    })

    const topProductos = Object.entries(contador)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([id]) => parseInt(id))

    const productosFrecuentes = await Producto.findAll({
      where: { id: topProductos, activo: true },
      include: [{ model: Categoria, as: 'categoria' }, { model: Ingrediente, as: 'ingredientes' }]
    })

    const productosSimilares = await Producto.findAll({
      where: {
        id_categoria: { [Op.in]: Array.from(categorias) },
        activo: true,
        id: { [Op.notIn]: topProductos }
      },
      limit: 5,
      include: [{ model: Categoria, as: 'categoria' }, { model: Ingrediente, as: 'ingredientes' }]
    })

    const frecuentesConPrecio = productosFrecuentes.map(p => {
      const prod = p.toJSON()
      prod.precioReal = calcularPrecioReal(prod)
      return prod
    })

    const similaresConPrecio = productosSimilares.map(p => {
      const prod = p.toJSON()
      prod.precioReal = calcularPrecioReal(prod)
      return prod
    })

    const ingredienteTop = Object.entries(ingredientesUsados).sort((a, b) => b[1] - a[1])[0]
    const tamanoTop = Object.entries(tamanosUsados).sort((a, b) => b[1] - a[1])[0]
    const combinacionTop = Object.entries(combinaciones).sort((a, b) => b[1] - a[1])[0]

    const sugerenciasPersonalizadas = similaresConPrecio.filter(p =>
      p.ingredientes.some(i => i.id === parseInt(ingredienteTop?.[0]))
    )

    res.json({
      tipo: 'profundo',
      frecuentes: frecuentesConPrecio,
      similares: similaresConPrecio,
      sugerenciasPersonalizadas,
      preferencia: {
        ingredienteFavorito: ingredienteTop ? parseInt(ingredienteTop[0]) : null,
        tamanoFavorito: tamanoTop ? parseInt(tamanoTop[0]) : null,
        combinacionFrecuente: combinacionTop ? combinacionTop[0] : null
      }
    })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al generar recomendaciones', error: error.message })
  }
}
