import { EstadoPedido } from '../models/estado_pedido.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'

export const getEstados = async (req, res) => {
  try {
    const { nombre, activo } = req.query
    const whereClause = {}

    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }

    if (req.user?.rol === ROLES.ADMINISTRADOR || req.user?.rol === ROLES.PERSONAL) {
      if (activo !== undefined) whereClause.activo = activo === 'true'
    } else {
      whereClause.activo = true
    }

    const estados = await EstadoPedido.findAll({ where: whereClause })
    res.json(estados)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los estados', error: error.message })
  }
}

export const getEstadoById = async (req, res) => {
  const { id } = req.params
  try {
    const estado = await EstadoPedido.findByPk(id)
    if (!estado) return res.status(404).json({ mensaje: 'Estado no encontrado' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!estado.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este estado' })
    }

    res.json(estado)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el estado', error: error.message })
  }
}

export const createEstado = async (req, res) => {
  const { nombre } = req.body
  try {
    const nuevoEstado = await EstadoPedido.create({ nombre, activo: true })
    res.status(201).json({ mensaje: 'Estado creado correctamente', estado: nuevoEstado })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el estado', error: error.message })
  }
}

export const updateEstado = async (req, res) => {
  const { id } = req.params
  const { nombre, activo } = req.body
  try {
    const estado = await EstadoPedido.findByPk(id)
    if (!estado) return res.status(404).json({ mensaje: 'Estado no encontrado' })
    estado.nombre = nombre ?? estado.nombre
    if (activo !== undefined) estado.activo = activo
    await estado.save()
    res.json({ mensaje: 'Estado actualizado correctamente', estado })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el estado', error: error.message })
  }
}

export const deleteEstado = async (req, res) => {
  const { id } = req.params
  try {
    const estado = await EstadoPedido.findByPk(id)
    if (!estado) return res.status(404).json({ mensaje: 'Estado no encontrado' })
    estado.activo = false
    await estado.save()
    res.json({ mensaje: 'Estado desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el estado', error: error.message })
  }
}
