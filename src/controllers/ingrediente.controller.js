import { Ingrediente } from '../models/ingrediente.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'

export const getIngredientes = async (req, res) => {
  try {
    console.log(req.user)
    const { nombre, activo } = req.query
    const whereClause = {}

    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }

    if (req.user?.rol === ROLES.ADMINISTRADOR || req.user?.rol === ROLES.PERSONAL) {
      if (activo !== undefined) whereClause.activo = activo === 'true'
    } else {
      whereClause.activo = true
    }

    const ingredientes = await Ingrediente.findAll({ where: whereClause })
    res.json(ingredientes)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ingredientes', error: error.message })
  }
}

export const getIngredienteById = async (req, res) => {
  const { id } = req.params
  try {
    const ingrediente = await Ingrediente.findByPk(id)
    if (!ingrediente) return res.status(404).json({ mensaje: 'Ingrediente no encontrado' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!ingrediente.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este ingrediente' })
    }

    res.json(ingrediente)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener ingrediente', error: error.message })
  }
}

export const createIngrediente = async (req, res) => {
  const { nombre, costo_extra: costoExtra, stock, activo } = req.body
  try {
    const nuevoIngrediente = await Ingrediente.create({
      nombre,
      costo_extra: costoExtra ?? 0.00,
      stock: stock ?? 0,
      activo: activo ?? true
    })

    res.status(201).json({ mensaje: 'Ingrediente creado', ingrediente: nuevoIngrediente })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear ingrediente', error: error.message })
  }
}

export const updateIngrediente = async (req, res) => {
  const { id } = req.params
  const { nombre, costo_extra: costoExtra, stock, activo } = req.body
  try {
    const ingrediente = await Ingrediente.findByPk(id)
    if (!ingrediente) return res.status(404).json({ mensaje: 'Ingrediente no encontrado' })

    ingrediente.nombre = nombre ?? ingrediente.nombre
    ingrediente.costo_extra = costoExtra ?? ingrediente.costo_extra
    ingrediente.stock = stock ?? ingrediente.stock
    ingrediente.activo = activo ?? ingrediente.activo

    await ingrediente.save()
    res.json({ mensaje: 'Ingrediente actualizado', ingrediente })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar ingrediente', error: error.message })
  }
}

export const deleteIngrediente = async (req, res) => {
  const { id } = req.params
  try {
    const ingrediente = await Ingrediente.findByPk(id)
    if (!ingrediente) return res.status(404).json({ mensaje: 'Ingrediente no encontrado' })

    ingrediente.activo = false
    await ingrediente.save()
    res.json({ mensaje: 'Ingrediente desactivado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar ingrediente', error: error.message })
  }
}
