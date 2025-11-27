import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getPedidosReport,
  getVentasReport,
  getProductosReport,
  getCategoriasReport,
  getIngredientesReport,
  getClientesReport
} from '../controllers/reporte.controller.js'

const router = Router()

router.get(
  '/pedidos',
  authenticate,
  requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]),
  getPedidosReport
)

router.get(
  '/ventas',
  authenticate,
  requireRole([ROLES.ADMINISTRADOR]),
  getVentasReport
)

router.get(
  '/productos',
  authenticate,
  requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]),
  getProductosReport
)

router.get(
  '/categorias',
  authenticate,
  requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]),
  getCategoriasReport
)

router.get(
  '/ingredientes',
  authenticate,
  requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]),
  getIngredientesReport
)

router.get(
  '/clientes',
  authenticate,
  requireRole([ROLES.ADMINISTRADOR]),
  getClientesReport
)

export default router
