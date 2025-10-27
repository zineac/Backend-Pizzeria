import { Router } from 'express'
import { registerUser, loginUser, verifyToken, logoutUser } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', registerUser)
router.post('/login', loginUser)
router.get('/verify', verifyToken)
router.post('/logout', logoutUser)

export default router
