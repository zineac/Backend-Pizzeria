import { Usuario } from '../models/usuario.model.js'
import { ROLES } from '../config/roles.config.js'
import { Op } from 'sequelize'
import bcrypt from 'bcrypt'

export const updateMe = async (req, res) => {
  const { nombre, email, telefono, direccion, password } = req.body
  try {
    const usuario = await Usuario.findByPk(req.user.id)
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    if (email) {
      const existingUsuario = await Usuario.findOne({ where: { email, id: { [Op.ne]: usuario.id } } })
      if (existingUsuario) return res.status(400).json({ mensaje: 'El email ya está registrado' })
      usuario.email = email
    }

    usuario.nombre = nombre ?? usuario.nombre
    usuario.telefono = telefono ?? usuario.telefono
    usuario.direccion = direccion ?? usuario.direccion
    if (password) usuario.password = await bcrypt.hash(password, 10)

    await usuario.save()
    const updatedUsuario = await Usuario.findByPk(usuario.id, { include: { association: 'rol' }, attributes: { exclude: ['password'] } })
    res.json({ mensaje: 'Perfil actualizado', usuario: updatedUsuario })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar perfil', error: error.message })
  }
}

export const deleteMe = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.user.id)
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    usuario.activo = false
    await usuario.save()
    res.json({ mensaje: 'Usuario desactivado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar usuario', error: error.message })
  }
}

export const createUsuario = async (req, res) => {
  const { nombre, email, password, telefono, direccion, id_rol: idRol } = req.body
  try {
    const existingUsuario = await Usuario.findOne({ where: { email } })
    if (existingUsuario) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' })
    }

    const hash = await bcrypt.hash(password, 10)
    const nuevoUsuario = await Usuario.create({
      nombre,
      email,
      password: hash,
      telefono,
      direccion,
      id_rol: idRol
    })

    const usuarioConRol = await Usuario.findByPk(nuevoUsuario.id, { include: { association: 'rol' } })
    const usuarioData = usuarioConRol.toJSON()
    delete usuarioData.password

    res.status(201).json({ mensaje: 'Usuario creado', usuario: usuarioData })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message })
  }
}

export const getUsuarios = async (req, res) => {
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

    const usuarios = await Usuario.findAll({
      where: whereClause,
      include: { association: 'rol' },
      attributes: { exclude: ['password'] }
    })

    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuarios', error: error.message })
  }
}

export const getUsuarioById = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id, { include: { association: 'rol' }, attributes: { exclude: ['password'] } })
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    if (req.user.rol === ROLES.PERSONAL && usuario.id_rol !== 1) {
      return res.status(403).json({ mensaje: 'No tienes permiso para ver este usuario' })
    }

    res.json(usuario)
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener usuario', error: error.message })
  }
}

export const updateUsuario = async (req, res) => {
  const { id } = req.params
  const { nombre, email, telefono, direccion, activo, id_rol: idRol } = req.body
  try {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    if (email) {
      const existingUsuario = await Usuario.findOne({ where: { email, id: { [Op.ne]: id } } })
      if (existingUsuario) {
        return res.status(400).json({ mensaje: 'El email ya está registrado en otro usuario' })
      }
    }

    usuario.nombre = nombre ?? usuario.nombre
    usuario.email = email ?? usuario.email
    usuario.telefono = telefono ?? usuario.telefono
    usuario.direccion = direccion ?? usuario.direccion
    usuario.activo = activo ?? usuario.activo
    if (idRol) usuario.id_rol = idRol

    await usuario.save()
    const updatedUsuario = await Usuario.findByPk(usuario.id, { include: { association: 'rol' }, attributes: { exclude: ['password'] } })
    res.json({ mensaje: 'Usuario actualizado', usuario: updatedUsuario })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message })
  }
}

export const deleteUsuario = async (req, res) => {
  const { id } = req.params
  try {
    const usuario = await Usuario.findByPk(id)
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' })

    usuario.activo = false
    await usuario.save()
    res.json({ mensaje: 'Usuario desactivado' })
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al desactivar usuario', error: error.message })
  }
}
