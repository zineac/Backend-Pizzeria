import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getCategorias,
  getCategoriaById,
  createCategoria,
  updateCategoria,
  deleteCategoria
} from '../controllers/categoria.controller.js'

const router = Router()

router.get('/', authenticate, getCategorias)
router.get('/:id', authenticate, getCategoriaById)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createCategoria)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), updateCategoria)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteCategoria)

export default router
