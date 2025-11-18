import { Router } from 'express'
import { authenticate, authenticateOptional } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getTamanos,
  getTamanoById,
  createTamano,
  updateTamano,
  deleteTamano
} from '../controllers/tamano.controller.js'

const router = Router()

router.get('/', authenticateOptional, getTamanos)
router.get('/:id', authenticateOptional, getTamanoById)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createTamano)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), updateTamano)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteTamano)

export default router
