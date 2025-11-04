import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getEstados,
  getEstadoById,
  createEstado,
  updateEstado,
  deleteEstado
} from '../controllers/estado.controller.js'

const router = Router()

router.get('/', authenticate, getEstados)
router.get('/:id', authenticate, getEstadoById)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createEstado)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), updateEstado)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteEstado)

export default router
