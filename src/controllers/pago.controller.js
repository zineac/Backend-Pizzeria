import { MetodoPago } from '../models/metodo_pago.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'

export const getMetodosPago = async (req, res) => {
  try {
    const { tipo, activo } = req.query
    const whereClause = {}

    if (tipo) whereClause.tipo = { [Op.like]: `%${tipo}%` }

    if (req.user?.rol === ROLES.ADMINISTRADOR || req.user?.rol === ROLES.PERSONAL) {
      if (activo !== undefined) whereClause.activo = activo === 'true'
    } else {
      whereClause.activo = true
    }

    const metodos = await MetodoPago.findAll({ where: whereClause })
    res.json(metodos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los métodos de pago', error: error.message })
  }
}

export const getMetodoPagoById = async (req, res) => {
  const { id } = req.params
  try {
    const metodo = await MetodoPago.findByPk(id)
    if (!metodo) return res.status(404).json({ mensaje: 'Método de pago no encontrado' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!metodo.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este método de pago' })
    }

    res.json(metodo)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el método de pago', error: error.message })
  }
}

export const createMetodoPago = async (req, res) => {
  const { tipo, descripcion } = req.body
  try {
    const nuevoMetodo = await MetodoPago.create({ tipo, descripcion, activo: true })
    res.status(201).json({ mensaje: 'Método de pago creado correctamente', metodo: nuevoMetodo })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el método de pago', error: error.message })
  }
}

export const updateMetodoPago = async (req, res) => {
  const { id } = req.params
  const { tipo, descripcion, activo } = req.body
  try {
    const metodo = await MetodoPago.findByPk(id)
    if (!metodo) return res.status(404).json({ mensaje: 'Método de pago no encontrado' })
    metodo.tipo = tipo ?? metodo.tipo
    metodo.descripcion = descripcion ?? metodo.descripcion
    if (activo !== undefined) metodo.activo = activo
    await metodo.save()
    res.json({ mensaje: 'Método de pago actualizado correctamente', metodo })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el método de pago', error: error.message })
  }
}

export const deleteMetodoPago = async (req, res) => {
  const { id } = req.params
  try {
    const metodo = await MetodoPago.findByPk(id)
    if (!metodo) return res.status(404).json({ mensaje: 'Método de pago no encontrado' })
    metodo.activo = false
    await metodo.save()
    res.json({ mensaje: 'Método de pago desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el método de pago', error: error.message })
  }
}
