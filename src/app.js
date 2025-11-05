import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import authRoutes from './routes/auth.routes.js'
import usuarioRoutes from './routes/usuario.routes.js'
import ingredienteRoutes from './routes/ingrediente.routes.js'
import productoRoutes from './routes/producto.routes.js'
import rolRoutes from './routes/rol.routes.js'
import pagoRoutes from './routes/pago.routes.js'
import estadoRoutes from './routes/estado.routes.js'
import categoriaRoutes from './routes/categoria.routes.js'
import tamanoRoutes from './routes/tamano.routes.js'

const app = express()

app.use(cors({ origin: ['*', undefined], credentials: true }))
app.use(express.json())
app.use(cookieParser())

app.get('/', (_, res) => res.json({ mensaje: 'Api' }))
app.use('/api/auth', authRoutes)
app.use('/api/usuario', usuarioRoutes)
app.use('/api/ingrediente', ingredienteRoutes)
app.use('/api/producto', productoRoutes)
app.use('/api/rol', rolRoutes)
app.use('/api/pago', pagoRoutes)
app.use('/api/estado', estadoRoutes)
app.use('/api/categoria', categoriaRoutes)
app.use('/api/tamano', tamanoRoutes)

export default app
