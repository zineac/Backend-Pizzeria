import { Router } from 'express'
import { authenticate, authenticateOptional } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getProductos,
  getProductoById,
  createProducto,
  updateProducto,
  deleteProducto,
  getIngredientesDeProducto,
  addIngredientesToProducto,
  removeIngredienteFromProducto
} from '../controllers/producto.controller.js'

const router = Router()

router.get('/', authenticateOptional, getProductos)
router.get('/:id', authenticateOptional, getProductoById)
router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createProducto)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), updateProducto)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteProducto)

router.get('/:id/ingrediente', authenticateOptional, getIngredientesDeProducto)
router.post('/:id/ingrediente', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), addIngredientesToProducto)
router.delete('/:id/ingrediente/:idIng', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), removeIngredienteFromProducto)

export default router
