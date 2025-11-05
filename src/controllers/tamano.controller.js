import { Tamano } from '../models/tamano.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'

export const getTamanos = async (req, res) => {
  try {
    const { nombre, activo } = req.query
    const whereClause = {}

    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }

    // Solo administradores y personal pueden filtrar por inactivos
    if ([ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)) {
      if (activo !== undefined) whereClause.activo = activo === 'true'
    } else {
      whereClause.activo = true
    }

    const tamanos = await Tamano.findAll({ where: whereClause })
    res.json(tamanos)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener los tamaños', error: error.message })
  }
}

export const getTamanoById = async (req, res) => {
  const { id } = req.params
  try {
    const tamano = await Tamano.findByPk(id)
    if (!tamano) return res.status(404).json({ mensaje: 'Tamaño no encontrado' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!tamano.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este tamaño' })
    }

    res.json(tamano)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener el tamaño', error: error.message })
  }
}

export const createTamano = async (req, res) => {
  const { nombre, factor_precio: factorPrecio } = req.body
  try {
    const nuevoTamano = await Tamano.create({ nombre, factor_precio: factorPrecio, activo: true })
    res.status(201).json({ mensaje: 'Tamaño creado correctamente', tamano: nuevoTamano })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear el tamaño', error: error.message })
  }
}

export const updateTamano = async (req, res) => {
  const { id } = req.params
  const { nombre, factor_precio: factorPrecio, activo } = req.body
  try {
    const tamano = await Tamano.findByPk(id)
    if (!tamano) return res.status(404).json({ mensaje: 'Tamaño no encontrado' })

    tamano.nombre = nombre ?? tamano.nombre
    tamano.factor_precio = factorPrecio ?? tamano.factor_precio
    if (activo !== undefined) tamano.activo = activo

    await tamano.save()
    res.json({ mensaje: 'Tamaño actualizado correctamente', tamano })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar el tamaño', error: error.message })
  }
}

export const deleteTamano = async (req, res) => {
  const { id } = req.params
  try {
    const tamano = await Tamano.findByPk(id)
    if (!tamano) return res.status(404).json({ mensaje: 'Tamaño no encontrado' })

    tamano.activo = false
    await tamano.save()
    res.json({ mensaje: 'Tamaño desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar el tamaño', error: error.message })
  }
}
