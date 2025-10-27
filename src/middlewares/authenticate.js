import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.config.js'

export const authenticate = (req, res, next) => {
  const { token } = req.cookies
  if (!token) return res.status(401).json({ mensaje: 'No autenticado' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ mensaje: 'Token inválido' })
  }
}
