import { Usuario } from '../models/usuario.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'

export const updateMe = async (req, res) => {
  const { nombre, email, telefono, direccion, password } = req.body
  try {
    const user = await Usuario.findByPk(req.user.id)
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    if (email) {
      const existingUser = await Usuario.findOne({ where: { email, id: { [Op.ne]: user.id } } })
      if (existingUser) return res.status(400).json({ mensaje: 'El email ya está registrado' })
      user.email = email
    }

    user.nombre = nombre ?? user.nombre
    user.telefono = telefono ?? user.telefono
    user.direccion = direccion ?? user.direccion
    if (password) user.password = await bcrypt.hash(password, 10)

    await user.save()
    const updatedUser = await Usuario.findByPk(user.id, { include: { association: 'rol' }, attributes: { exclude: ['password'] } })
    res.json({ mensaje: 'Perfil actualizado', usuario: updatedUser })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message })
  }
}

export const deleteMe = async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.user.id)
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    user.activo = false
    await user.save()
    res.json({ mensaje: 'Usuario desactivado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar usuario', error: error.message })
  }
}

export const createUser = async (req, res) => {
  const { nombre, email, password, telefono, direccion, id_rol: idRol } = req.body
  try {
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const newUser = await Usuario.create({
      nombre,
      email,
      password: hash,
      telefono,
      direccion,
      id_rol: idRol
    })

    const userWithRole = await Usuario.findByPk(newUser.id, { include: { association: 'rol' } })
    const userData = userWithRole.toJSON()
    delete userData.password

    res.status(201).json({ mensaje: 'Usuario creado', usuario: userData })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message })
  }
}

export const getUsers = async (req, res) => {
  const { nombre, activo, rol } = req.query
  try {
    const whereClause = {}
    if (nombre) whereClause.nombre = { [Op.like]: `%${nombre}%` }
    if (activo !== undefined) whereClause.activo = activo === 'true'

    if (req.user.rol === ROLES.PERSONAL) {
      whereClause.id_rol = 1
    } else if (req.user.rol === ROLES.ADMINISTRADOR && rol) {
      whereClause.id_rol = Number(rol)
    }

    const users = await Usuario.findAll({
      where: whereClause,
      include: { association: 'rol' },
      attributes: { exclude: ['password'] }
    })

    res.json(users)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message })
  }
}

export const getUserById = async (req, res) => {
  const { id } = req.params
  try {
    const user = await Usuario.findByPk(id, { include: { association: 'rol' }, attributes: { exclude: ['password'] } })
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    if (req.user.rol === ROLES.PERSONAL && user.id_rol !== 1) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este usuario' })
    }

    res.json(user)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message })
  }
}

export const updateUser = async (req, res) => {
  const { id } = req.params
  const { nombre, email, telefono, direccion, activo, id_rol: idRol } = req.body
  try {
    const user = await Usuario.findByPk(id)
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    if (email) {
      const existingUser = await Usuario.findOne({ where: { email, id: { [Op.ne]: id } } })
      if (existingUser) {
        return res.status(400).json({ mensaje: 'El email ya está registrado en otro usuario' })
      }
    }

    user.nombre = nombre ?? user.nombre
    user.email = email ?? user.email
    user.telefono = telefono ?? user.telefono
    user.direccion = direccion ?? user.direccion
    user.activo = activo ?? user.activo
    if (idRol) user.id_rol = idRol

    await user.save()
    const updatedUser = await Usuario.findByPk(user.id, { include: { association: 'rol' }, attributes: { exclude: ['password'] } })
    res.json({ mensaje: 'Usuario actualizado', usuario: updatedUser })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message })
  }
}

export const deleteUser = async (req, res) => {
  const { id } = req.params
  try {
    const user = await Usuario.findByPk(id)
    if (!user) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    user.activo = false
    await user.save()
    res.json({ mensaje: 'Usuario desactivado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar usuario', error: error.message })
  }
}
