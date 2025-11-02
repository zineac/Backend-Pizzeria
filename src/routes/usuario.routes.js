import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  updateMe,
  deleteMe,
  createUsuario,
  getUsuarios,
  getUsuarioById,
  updateUsuario,
  deleteUsuario
} from '../controllers/usuario.controller.js'

const router = Router()

router.put('/me', authenticate, updateMe)
router.delete('/me', authenticate, deleteMe)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createUsuario)
router.get('/', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), getUsuarios)
router.get('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), getUsuarioById)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), updateUsuario)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteUsuario)

export default router
