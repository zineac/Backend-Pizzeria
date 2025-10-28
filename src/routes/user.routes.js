import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'
import {
  updateMe,
  deleteMe,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser
} from '../controllers/user.controller.js'

const router = Router()

router.put('/me', authenticate, updateMe)
router.delete('/me', authenticate, deleteMe)

router.post('/', authenticate, requireRole([ROLES.ADMINISTRADOR]), createUser)
router.get('/', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), getUsers)
router.get('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR, ROLES.PERSONAL]), getUserById)
router.put('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), updateUser)
router.delete('/:id', authenticate, requireRole([ROLES.ADMINISTRADOR]), deleteUser)

export default router
