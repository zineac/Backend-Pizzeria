import { Router } from 'express'
import { getSugerencias } from '../controllers/sugerencia.controller.js'
import { authenticate } from '../middlewares/authenticate.js'
import { requireRole } from '../middlewares/authorize.js'
import { ROLES } from '../config/roles.config.js'

const router = Router()

router.get('/', authenticate, requireRole([ROLES.CLIENTE]), getSugerencias)

export default router
