import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  deleteRol
} from '../controllers/rol.controller.js'

const router = Router()

router.use(authenticate, requireRole([ROLES.ADMINISTRADOR]))

router.get('/', getRoles)
router.get('/:id', getRolById)
router.post('/', createRol)
router.put('/:id', updateRol)
router.delete('/:id', deleteRol)

export default router
