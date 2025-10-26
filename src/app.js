import express from 'express'
const app = express()

app.use(express.json())

app.get('', (_, res) => {
  return res.json({ mensaje: 'Hola mundo :D' })
})

export default app
