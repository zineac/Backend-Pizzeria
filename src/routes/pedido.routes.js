import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import {
  getPedidos,
  getPedidoById,
  createPedido,
  updateEstadoPedido,
  deletePedido,
  recibirNotificacionPago
} from '../controllers/pedido.controller.js'
import { ROLES } from '../config/roles.config.js'

const router = Router()

router.get('/', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL, ROLES.REPARTIDOR, ROLES.CLIENTE]), getPedidos)
router.get('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL, ROLES.REPARTIDOR, ROLES.CLIENTE]), getPedidoById)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL, ROLES.CLIENTE]), createPedido)
router.put('/:id/estado', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL, ROLES.REPARTIDOR]), updateEstadoPedido)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.CLIENTE]), deletePedido)
router.post('/notificacion', recibirNotificacionPago)

export default router
