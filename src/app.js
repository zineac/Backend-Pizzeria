import express from 'express'
import { testConnectDB, syncDB } from './config/db.config.js'
import './models/init.js'

await syncDB()
await testConnectDB()
const app = express()

app.use(express.json())

app.get('/', (_, res) => {
  return res.json({ mensaje: 'Hola mundo :D' })
})

export default app
