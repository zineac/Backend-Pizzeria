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
import { MercadoPagoConfig, Preference, Payment } from 'mercadopago'
import { MP_ACCESS_TOKEN, FRONTEND_URL, NOTIFICATION_URL } from '../config/env.config.js'
import { db } from '../config/db.config.js'

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

export const createPedido = async (req, res) => {
  const transaction = await db.transaction()
  try {
    const {
      id_cliente: idCliente,
      id_repartidor: idRepartidor,
      id_metodo_pago: idMetodoPago,
      detalles
    } = req.body

    const pedido = await Pedido.create({
      id_cliente: idCliente,
      id_repartidor: idRepartidor || null,
      id_metodo_pago: idMetodoPago,
      total: 0
    }, { transaction })

    let totalPedido = 0

    for (const detalle of detalles) {
      const producto = await Producto.findByPk(detalle.id_producto)
      if (!producto) throw new Error(`Producto ${detalle.id_producto} no encontrado`)

      const precioBase = parseFloat(producto.precio)
      let costoExtraIngredientes = 0
      let factorTamano = 1

      const { personalizaciones } = detalle

      if (personalizaciones?.ingredientes?.length) {
        const idsIng = personalizaciones.ingredientes.map(i => i.id_ingrediente)
        const ingredientesDB = await Ingrediente.findAll({ where: { id: idsIng } })

        costoExtraIngredientes = personalizaciones.ingredientes.reduce((sum, ing) => {
          const ingredienteDB = ingredientesDB.find(i => i.id === ing.id_ingrediente)
          const costoExtra = ingredienteDB ? parseFloat(ingredienteDB.costo_extra || 0) : 0
          return sum + (costoExtra * (ing.cantidad || 1))
        }, 0)
      }

      if (personalizaciones?.id_tamano) {
        const tamano = await Tamano.findByPk(personalizaciones.id_tamano)
        if (tamano) factorTamano = parseFloat(tamano.factor_precio || 1)
      }

      const precioUnitario = (precioBase + costoExtraIngredientes) * factorTamano
      const subtotal = precioUnitario * detalle.cantidad
      totalPedido += subtotal

      const detallePedido = await DetallePedido.create({
        id_pedido: pedido.id,
        id_producto: detalle.id_producto,
        cantidad: detalle.cantidad,
        precio_unitario: precioUnitario
      }, { transaction })

      if (personalizaciones?.id_tamano) {
        await PedidoDetallePersonalizacion.create({
          id_detalle_pedido: detallePedido.id,
          id_tamano: personalizaciones.id_tamano
        }, { transaction })
      }

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

    pedido.total = totalPedido
    await pedido.save({ transaction })

    const infoPreferencia = {
      items: [
        {
          title: `Pedido #${pedido.id}`,
          unit_price: Number(totalPedido),
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

    const preferencia = new Preference(mp)
    const respuesta = await preferencia.create({ body: infoPreferencia })
    await transaction.commit()

    res.status(201).json({
      mensaje: 'Pedido creado correctamente',
      pedido,
      url_pago: respuesta.init_point
    })
  } catch (error) {
    console.log(error)
    if (transaction && !transaction.finished) await transaction.rollback()
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
