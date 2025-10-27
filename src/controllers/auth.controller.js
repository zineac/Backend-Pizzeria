import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { Usuario } from '../models/usuario.model.js'
import { Rol } from '../models/rol.model.js'
import { JWT_SECRET } from '../config/env.config.js'

export const registerUser = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const existingUser = await Usuario.findOne({ where: { email } })
    if (existingUser) return res.status(400).json({ mensaje: 'El email ya está registrado' })

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await Usuario.create({
      nombre,
      email,
      password: hashedPassword,
      id_rol: 1
    })

    res.status(201).json({ mensaje: 'Usuario registrado correctamente', userId: user.id })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error al registrar usuario' })
  }
}

export const loginUser = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await Usuario.findOne({ where: { email }, include: { model: Rol, as: 'rol' } })
    if (!user) return res.status(400).json({ mensaje: 'Usuario no encontrado' })

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) return res.status(400).json({ mensaje: 'Contraseña incorrecta' })

    const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol.nombre }, JWT_SECRET, { expiresIn: '8h' })

    res.cookie('token', token, { httpOnly: true, maxAge: 1000 * 60 * 60 })
    res.json({ mensaje: 'Login exitoso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ mensaje: 'Error en login' })
  }
}

export const verifyToken = async (req, res) => {
  const { token } = req.cookies
  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    res.json({ mensaje: 'Token válido', user: decoded })
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' })
  }
}

export const logoutUser = async (req, res) => {
  res.clearCookie('token')
  res.json({ mensaje: 'Logout exitoso' })
}
