import { Router } from 'express'
import { authenticate, authenticateOptional } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getIngredientes,
  getIngredienteById,
  createIngrediente,
  updateIngrediente,
  deleteIngrediente
} from '../controllers/ingrediente.controller.js'

const router = Router()

router.get('/', authenticateOptional, getIngredientes)
router.get('/:id', authenticateOptional, getIngredienteById)
router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createIngrediente)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), updateIngrediente)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteIngrediente)

export default router
