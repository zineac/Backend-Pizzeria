import express from 'express'
import cookieParser from 'cookie-parser'
import authRoutes from './routes/auth.routes.js'
import userRoutes from './routes/user.routes.js'

const app = express()
app.use(express.json())
app.use(cookieParser())

app.get('/', (_, res) => res.json({ mensaje: 'Api' }))
app.use('/api/auth', authRoutes)
app.use('/api/user', userRoutes)

export default app
