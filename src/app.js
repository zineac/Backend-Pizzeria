import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import ingredienteRoutes from './routes/ingrediente.routes.js'

const app = express()

app.use(cors({ origin: '*', credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (_, res) => res.json({ mensaje: 'Api' }))
app.use('/api/auth', authRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/ingrediente', ingredienteRoutes)

export default app
