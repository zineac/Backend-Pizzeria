import express from 'express'
import cookieParser from 'cookie-parser'
import { testConnectDB, syncDB } from './config/db.config.js'
import './models/init.js'
import authRoutes from './routes/auth.routes.js'

await syncDB()
await testConnectDB()
const app = express()

app.use(express.json())
app.use(cookieParser())
app.get('/', (_, res) => res.json({ mensaje: 'Api' }))
app.use('/api/auth', authRoutes)

export default app
