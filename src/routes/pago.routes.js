import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getMetodosPago,
  getMetodoPagoById,
  createMetodoPago,
  updateMetodoPago,
  deleteMetodoPago
} from '../controllers/pago.controller.js'

const router = Router()

router.get('/', authenticate, getMetodosPago)
router.get('/:id', authenticate, getMetodoPagoById)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createMetodoPago)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), updateMetodoPago)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteMetodoPago)

export default router
