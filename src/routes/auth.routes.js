import { Router } from 'express'
import { authenticate } from '../middlewares/authenticate.js'
import { registerUser, loginUser, getProfile, logoutUser } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/profile', authenticate, getProfile)
router.post('/logout', logoutUser)

export default router
