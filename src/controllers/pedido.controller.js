import { Pedido } from '../models/pedido.model.js'
import { DetallePedido } from '../models/detalle_pedido.model.js'
import { PedidoDetallePersonalizacion } from '../models/pedido_detalle_personalizacion.model.js'
import { Producto } from '../models/producto.model.js'
import { Ingrediente } from '../models/ingrediente.model.js'
import { Usuario } from '../models/usuario.model.js'
import { Tamano } from '../models/tamano.model.js'
import { MetodoPago } from '../models/metodo_pago.model.js'
import { EstadoPedido } from '../models/estado_pedido.model.js'
import { ROLES } from '../config/roles.config.js'
import { db } from '../config/db.config.js'

export const getPedidos = async (req, res) => {
  try {
    const { user } = req
    const where = {}

    if (user.rol === ROLES.CLIENTE) where.id_cliente = user.id
    if (user.rol === ROLES.REPARTIDOR) where.id_repartidor = user.id

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'repartidor', attributes: ['id', 'nombre'] },
        { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'tipo', 'descripcion'] },
        { model: EstadoPedido, as: 'estadoPedido', attributes: ['id', 'nombre'] },
        {
          model: DetallePedido,
          as: 'detalles',
          include: [
            { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] },
            {
              model: PedidoDetallePersonalizacion,
              as: 'personalizaciones',
              include: [
                { model: Ingrediente, as: 'ingrediente', attributes: ['id', 'nombre', 'costo_extra'] },
                { model: Tamano, as: 'tamano', attributes: ['id', 'nombre', 'factor_precio'] }
              ]
            }
          ]
        }
      ],
      order: [['id', 'DESC']]
    })

    res.status(200).json(pedidos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los pedidos', error: error.message })
  }
}

export const getPedidoById = async (req, res) => {
  try {
    const { id } = req.params
    const { user } = req

    const pedido = await Pedido.findByPk(id, {
      include: [
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre'] },
        { model: Usuario, as: 'repartidor', attributes: ['id', 'nombre'] },
        { model: MetodoPago, as: 'metodoPago', attributes: ['id', 'tipo', 'descripcion'] },
        { model: EstadoPedido, as: 'estadoPedido', attributes: ['id', 'nombre'] },
        {
          model: DetallePedido,
          as: 'detalles',
          include: [
            { model: Producto, as: 'producto', attributes: ['id', 'nombre', 'precio'] },
            {
              model: PedidoDetallePersonalizacion,
              as: 'personalizaciones',
              include: [
                { model: Ingrediente, as: 'ingrediente', attributes: ['id', 'nombre', 'costo_extra'] },
                { model: Tamano, as: 'tamano', attributes: ['id', 'nombre', 'factor_precio'] }
              ]
            }
          ]
        }
      ]
    })

    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' })
    if (user.rol === ROLES.CLIENTE && pedido.id_cliente !== user.id) return res.status(403).json({ mensaje: 'No autorizado para ver este pedido' })
    if (user.rol === ROLES.REPARTIDOR && pedido.id_repartidor !== user.id) return res.status(403).json({ mensaje: 'No autorizado para ver este pedido' })

    res.status(200).json(pedido)
  } catch (error) {
    res.status(500).json({
      mensaje: 'Error al obtener el pedido',
      error: error.message
    })
  }
}

export const createPedido = async (req, res) => {
  const transaction = await db.transaction()
  try {
    const {
      id_cliente: idCliente,
      id_repartidor: idRepartidor,
      id_metodo_pago: idMetodoPago,
      detalles
    } = req.body

    // Crear el pedido base
    const pedido = await Pedido.create({
      id_cliente: idCliente,
      id_repartidor: idRepartidor || null,
      id_metodo_pago: idMetodoPago,
      total: 0
    }, { transaction })

    let totalPedido = 0

    // Recorrer los detalles del pedido
    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.id_producto)
      if (!producto) throw new Error(`Producto ${detalle.id_producto} no encontrado`)

      const precioBase = parseFloat(producto.precio)
      let costoExtraIngredientes = 0
      let factorTamano = 1

      const { personalizaciones } = detalle

      // Ingredientes adicionales
      if (personalizaciones?.ingredientes?.length) {
        const idsIng = personalizaciones.ingredientes.map(i => i.id_ingrediente)
        const ingredientesDB = await Ingrediente.findAll({ where: { id: idsIng } })

        // Calcular costo extra considerando cantidad de cada ingrediente
        costoExtraIngredientes = personalizaciones.ingredientes.reduce((sum, ing) => {
          const ingredienteDB = ingredientesDB.find(i => i.id === ing.id_ingrediente)
          const costoExtra = ingredienteDB ? parseFloat(ingredienteDB.costo_extra || 0) : 0
          return sum + (costoExtra * (ing.cantidad || 1))
        }, 0)
      }

      // Factor del tamaño
      if (personalizaciones?.id_tamano) {
        const tamano = await Tamano.findByPk(personalizaciones.id_tamano)
        if (tamano) factorTamano = parseFloat(tamano.factor_precio || 1)
      }

      // Calcular precio real
      const precioUnitario = (precioBase + costoExtraIngredientes) * factorTamano
      const subtotal = precioUnitario * detalle.cantidad
      totalPedido += subtotal

      // Crear detalle
      const detallePedido = await DetallePedido.create({
        id_pedido: pedido.id,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: precioUnitario
      }, { transaction })

      // Personalización: tamaño
      if (personalizaciones?.id_tamano) {
        await PedidoDetallePersonalizacion.create({
          id_detalle_pedido: detallePedido.id,
          id_tamano: personalizaciones.id_tamano
        }, { transaction })
      }

      // Personalizaciones: ingredientes
      if (personalizaciones?.ingredientes?.length) {
        for (const ing of personalizaciones.ingredientes) {
          const ingredienteDB = await Ingrediente.findByPk(ing.id_ingrediente)
          await PedidoDetallePersonalizacion.create({
            id_detalle_pedido: detallePedido.id,
            id_ingrediente: ing.id_ingrediente,
            cantidad: ing.cantidad || 1,
            costo_extra: (ingredienteDB?.costo_extra || 0) * (ing.cantidad || 1)
          }, { transaction })
        }
      }
    }

    // Actualizar total del pedido
    pedido.total = totalPedido
    await pedido.save({ transaction })

    await transaction.commit()

    res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      pedido
    })
  } catch (error) {
    await transaction.rollback()
    res.status(500).json({
      mensaje: 'Error al crear pedido',
      error: error.message
    })
  }
}

export const updateEstadoPedido = async (req, res) => {
  try {
    const { id } = req.params
    const { id_estado: idEstado } = req.body

    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' })

    const estado = await EstadoPedido.findByPk(idEstado)
    if (!estado) return res.status(404).json({ mensaje: 'Estado no válido' })

    pedido.id_estado = idEstado
    await pedido.save()

    res.status(200).json({ mensaje: 'Estado del pedido actualizado correctamente', pedido })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado del pedido', error: error.message })
  }
}

export const deletePedido = async (req, res) => {
  try {
    const { id } = req.params
    const pedido = await Pedido.findByPk(id)
    if (!pedido) return res.status(404).json({ mensaje: 'Pedido no encontrado' })

    pedido.activo = false
    await pedido.save()

    res.status(200).json({ mensaje: 'Pedido eliminado (borrado lógico) correctamente', pedido })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar pedido', error: error.message })
  }
}
