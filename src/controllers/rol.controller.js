import { Rol } from '../models/rol.model.js'

export const getRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll()
    res.json(roles)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener roles', error: error.message })
  }
}

export const getRolById = async (req, res) => {
  const { id } = req.params
  try {
    const rol = await Rol.findByPk(id)
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' })
    res.json(rol)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener rol', error: error.message })
  }
}

export const createRol = async (req, res) => {
  const { nombre } = req.body
  try {
    const nuevoRol = await Rol.create({ nombre })
    res.status(201).json({ mensaje: 'Rol creado', rol: nuevoRol })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear rol', error: error.message })
  }
}

export const updateRol = async (req, res) => {
  const { id } = req.params
  const { nombre } = req.body
  try {
    const rol = await Rol.findByPk(id)
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' })

    rol.nombre = nombre ?? rol.nombre
    await rol.save()
    res.json({ mensaje: 'Rol actualizado', rol })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar rol', error: error.message })
  }
}

export const deleteRol = async (req, res) => {
  const { id } = req.params
  try {
    const rol = await Rol.findByPk(id)
    if (!rol) return res.status(404).json({ mensaje: 'Rol no encontrado' })

    await rol.destroy()
    res.json({ mensaje: 'Rol eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar rol', error: error.message })
  }
}
