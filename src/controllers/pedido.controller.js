import { Pedido } from '../models/pedido.model.js'
import { Rol } from '../models/rol.model.js'
import { DetallePedido } from '../models/detalle_pedido.model.js'
import { PedidoDetallePersonalizacion } from '../models/pedido_detalle_personalizacion.model.js'
import { Producto } from '../models/producto.model.js'
import { Ingrediente } from '../models/ingrediente.model.js'
import { Usuario } from '../models/usuario.model.js'
import { Tamano } from '../models/tamano.model.js'
import { MetodoPago } from '../models/metodo_pago.model.js'
import { EstadoPedido } from '../models/estado_pedido.model.js'
import { ROLES } from '../config/roles.config.js'
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { MP_ACCESS_TOKEN, FRONTEND_URL, NOTIFICATION_URL } from '../config/env.config.js'
import { db } from '../config/db.config.js'
import { Sequelize } from 'sequelize'
const mp = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN })

export const getPedidos = async (req, res) => {
  try {
    const { user } = req
    const where = {}

    if (user.rol === ROLES.CLIENTE) where.id_cliente = user.id
    if (user.rol === ROLES.REPARTIDOR) where.id_repartidor = user.id

    const pedidos = await Pedido.findAll({
      where,
      include: [
        { model: Usuario, as: 'cliente', attributes: ['id', 'nombre', 'direccion'] },
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

export const recibirNotificacionPago = async (req, res) => {
  const paymentId = req.body?.data?.id
  const tipoEvento = req.body?.type

  if (tipoEvento !== 'payment' || !paymentId) return res.status(400).send('Evento no procesado')

  try {
    const payment = await new Payment(mp).get({ id: paymentId })
    const { status, metadata } = payment
    const { id_pedido: idPedido } = metadata || {}

    if (status === 'approved' && idPedido) {
      const pedido = await Pedido.findByPk(idPedido)
      if (!pedido) return res.status(404).send('Pedido no encontrado')

      const estadoPagado = await EstadoPedido.findOne({ where: { nombre: 'Pagado' } })
      if (estadoPagado && pedido.id_estado !== estadoPagado.id) {
        pedido.id_estado = estadoPagado.id
        await pedido.save()
      }
    }

    res.sendStatus(200)
  } catch (error) {
    console.error('Webhook error:', error.message)
    res.status(500).send('Error al procesar notificación')
  }
}

export async function validarIdsPedido ({ idCliente, idRepartidor, idMetodoPago, detalles }) {
  const cliente = await Usuario.findByPk(idCliente)
  if (!cliente) throw new Error(`El cliente con id ${idCliente} no existe`)

  if (idRepartidor) {
    const repartidor = await Usuario.findByPk(idRepartidor)
    if (!repartidor) throw new Error(`El repartidor con id ${idRepartidor} no existe`)
  }

  const metodo = await MetodoPago.findByPk(idMetodoPago)
  if (!metodo) throw new Error(`El método de pago con id ${idMetodoPago} no existe`)

  const productoIds = [...new Set(detalles.map(d => d.id_producto))]
  const productos = await Producto.findAll({ where: { id: productoIds } })
  const productosMap = new Map(productos.map(p => [p.id, p]))
  for (const id of productoIds) {
    if (!productosMap.has(id)) throw new Error(`El producto con id ${id} no existe`)
  }
  return { productosMap }
}

export async function obtenerRepartidorConMenosPedidos (transaction = null) {
  const rol = await Rol.findOne({ where: { nombre: ROLES.REPARTIDOR }, transaction })
  if (!rol) throw new Error('El rol "Repartidor" no existe')

  const sql = `
    SELECT u.id
    FROM usuarios u
    LEFT JOIN pedidos p ON p.id_repartidor = u.id
    WHERE u.id_rol = :rolId
    GROUP BY u.id
    ORDER BY COUNT(p.id) ASC
    LIMIT 1
  `
  const [results] = await db.query(sql, { replacements: { rolId: rol.id }, transaction, type: Sequelize.QueryTypes.SELECT })
  if (!results) {
    const repartidor = await Usuario.findOne({ where: { id_rol: rol.id }, attributes: ['id'], transaction })
    if (!repartidor) throw new Error('No hay repartidores registrados')
    return repartidor.id
  }
  return results.id
}

function buildPreferenciaMP (pedido, total, FRONTEND_URL, NOTIFICATION_URL) {
  return {
    items: [
      {
        title: `Pedido #${pedido.id}`,
        unit_price: Number(total),
        quantity: 1
      }
    ],
    back_urls: {
      success: FRONTEND_URL,
      failure: FRONTEND_URL,
      pending: FRONTEND_URL
    },
    notification_url: NOTIFICATION_URL,
    auto_return: 'approved',
    metadata: {
      id_pedido: pedido.id,
      id_cliente: pedido.id_cliente
    },
    payment_methods: {
      installments: 1,
      excluded_payment_types: [
        { id: 'atm' },
        { id: 'ticket' }
      ]
    }
  }
}

function prepararFilasDetalles (detalles, pedidoId, productosMap, ingredientesMap, tamanosMap) {
  const detallesRows = []
  const personalizacionesRows = []
  let totalPedido = 0

  for (const det of detalles) {
    const cantidad = Number(det.cantidad || 1)
    const producto = productosMap.get(det.id_producto)
    const precioBase = parseFloat(producto.precio || 0)

    let costoExtraIngredientes = 0
    if (det.personalizaciones?.ingredientes?.length) {
      for (const ing of det.personalizaciones.ingredientes) {
        const ingDB = ingredientesMap.get(ing.id_ingrediente)
        const costoExtra = ingDB ? parseFloat(ingDB.costo_extra || 0) : 0
        const qty = Number(ing.cantidad || 1)
        costoExtraIngredientes += costoExtra * qty
      }
    }

    let factorTamano = 1
    if (det.personalizaciones?.id_tamano) {
      const t = tamanosMap.get(det.personalizaciones.id_tamano)
      if (t) factorTamano = parseFloat(t.factor_precio || 1)
    }

    const precioUnitario = Math.round(((precioBase + costoExtraIngredientes) * factorTamano + Number.EPSILON) * 100) / 100
    const subtotal = Math.round((precioUnitario * cantidad + Number.EPSILON) * 100) / 100
    totalPedido += subtotal

    detallesRows.push({
      id_pedido: pedidoId,
      id_producto: det.id_producto,
      cantidad,
      precio_unitario: precioUnitario
    })

    const detalleIndex = detallesRows.length - 1

    if (det.personalizaciones?.id_tamano) {
      personalizacionesRows.push({
        __detalleIndex: detalleIndex,
        id_tamano: det.personalizaciones.id_tamano
      })
    }

    if (det.personalizaciones?.ingredientes?.length) {
      for (const ing of det.personalizaciones.ingredientes) {
        const cantidadIng = Number(ing.cantidad || 1)
        const ingDB = ingredientesMap.get(ing.id_ingrediente)
        const costoExtra = (ingDB?.costo_extra || 0) * cantidadIng
        personalizacionesRows.push({
          __detalleIndex: detalleIndex,
          id_ingrediente: ing.id_ingrediente,
          cantidad: cantidadIng,
          costo_extra: Math.round((costoExtra + Number.EPSILON) * 100) / 100
        })
      }
    }
  }

  return { detallesRows, personalizacionesRows, totalPedido }
}

export const createPedido = async (req, res) => {
  try {
    const { id_cliente: idCliente, id_metodo_pago: idMetodoPago, detalles } = req.body

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res.status(400).json({ mensaje: 'Detalles inválidos' })
    }

    const idRepartidor = await obtenerRepartidorConMenosPedidos()

    const { productosMap } = await validarIdsPedido({ idCliente, idRepartidor, idMetodoPago, detalles })

    const ingredienteIds = []
    const tamanoIds = []
    detalles.forEach(d => {
      if (d.personalizaciones?.ingredientes) d.personalizaciones.ingredientes.forEach(i => ingredienteIds.push(i.id_ingrediente))
      if (d.personalizaciones?.id_tamano) tamanoIds.push(d.personalizaciones.id_tamano)
    })

    const ingredientes = ingredienteIds.length ? await Ingrediente.findAll({ where: { id: [...new Set(ingredienteIds)] } }) : []
    const ingredientesMap = new Map(ingredientes.map(i => [i.id, i]))

    const tamanos = tamanoIds.length ? await Tamano.findAll({ where: { id: [...new Set(tamanoIds)] } }) : []
    const tamanosMap = new Map(tamanos.map(t => [t.id, t]))

    const transaction = await db.transaction()
    try {
      const pedido = await Pedido.create({
        id_cliente: idCliente,
        id_repartidor: idRepartidor || null,
        id_metodo_pago: idMetodoPago,
        total: 0
      }, { transaction })

      const { detallesRows, personalizacionesRows, totalPedido } = prepararFilasDetalles(detalles, pedido.id, productosMap, ingredientesMap, tamanosMap)

      const detallesCreados = await DetallePedido.bulkCreate(detallesRows, { transaction, returning: true })

      const detalleIdByIndex = detallesCreados.map(d => d.id)

      const personalizacionesFinal = personalizacionesRows.map(p => ({
        id_detalle_pedido: detalleIdByIndex[p.__detalleIndex],
        id_tamano: p.id_tamano || null,
        id_ingrediente: p.id_ingrediente || null,
        cantidad: p.cantidad || null,
        costo_extra: p.costo_extra || null
      }))

      if (personalizacionesFinal.length) {
        await PedidoDetallePersonalizacion.bulkCreate(personalizacionesFinal, { transaction })
      }

      pedido.total = Math.round((totalPedido + Number.EPSILON) * 100) / 100
      await pedido.save({ transaction })

      await transaction.commit()

      const infoPreferencia = buildPreferenciaMP(pedido, pedido.total, FRONTEND_URL, NOTIFICATION_URL)
      const preferencia = new Preference(mp)
      const respuesta = await preferencia.create({ body: infoPreferencia })

      pedido.pedido_url = respuesta.init_point
      await pedido.save()

      return res.status(201).json({ mensaje: 'Pedido creado correctamente', pedido })
    } catch (err) {
      if (transaction && !transaction.finished) await transaction.rollback()
      throw err
    }
  } catch (error) {
    return res.status(500).json({ mensaje: 'Error al crear pedido', error: error.message })
  }
}
