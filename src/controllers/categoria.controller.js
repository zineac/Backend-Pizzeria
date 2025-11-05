import { Categoria } from '../models/categoria.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'

export const getCategorias = async (req, res) => {
  try {
    const { nombre, activo } = req.query
    const whereClause = {}

    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }

    if ([ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)) {
      if (activo !== undefined) whereClause.activo = activo === 'true'
    } else {
      whereClause.activo = true
    }

    const categorias = await Categoria.findAll({ where: whereClause })
    res.json(categorias)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener las categorías', error: error.message })
  }
}

export const getCategoriaById = async (req, res) => {
  const { id } = req.params
  try {
    const categoria = await Categoria.findByPk(id)
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' })

    const puedeVerInactivos = [ROLES.ADMINISTRADOR, ROLES.PERSONAL].includes(req.user?.rol)
    if (!categoria.activo && !puedeVerInactivos) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver esta categoría' })
    }

    res.json(categoria)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener la categoría', error: error.message })
  }
}

export const createCategoria = async (req, res) => {
  const { nombre, descripcion } = req.body
  try {
    const nuevaCategoria = await Categoria.create({ nombre, descripcion, activo: true })
    res.status(201).json({ mensaje: 'Categoría creada correctamente', categoria: nuevaCategoria })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la categoría', error: error.message })
  }
}

export const updateCategoria = async (req, res) => {
  const { id } = req.params
  const { nombre, descripcion, activo } = req.body
  try {
    const categoria = await Categoria.findByPk(id)
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' })
    categoria.nombre = nombre ?? categoria.nombre
    categoria.descripcion = descripcion ?? categoria.descripcion
    if (activo !== undefined) categoria.activo = activo
    await categoria.save()
    res.json({ mensaje: 'Categoría actualizada correctamente', categoria })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar la categoría', error: error.message })
  }
}

export const deleteCategoria = async (req, res) => {
  const { id } = req.params
  try {
    const categoria = await Categoria.findByPk(id)
    if (!categoria) return res.status(404).json({ mensaje: 'Categoría no encontrada' })
    categoria.activo = false
    await categoria.save()
    res.json({ mensaje: 'Categoría desactivada correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la categoría', error: error.message })
  }
}
