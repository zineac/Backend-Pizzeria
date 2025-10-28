import { HOST, PORT } from './src/config/env.config.js'
import './src/models/init.js'
import { initDB } from './src/config/db.config.js'
import app from './src/app.js'

const startServer = async () => {
  try {
    await initDB()
    app.listen(PORT, () => {
      console.log(`Servidor corriendo -> http://${HOST}:${PORT}`)
    })
  } catch (error) {
    console.error(`Error al iniciar el servidor -> ${error.message}`)
    process.exit(1)
  }
}

startServer()
