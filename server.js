import app from './src/app.js'
import { HOST, PORT } from './src/config/env.config.js'

app.listen(PORT, () => {
  console.log(`Servidor corriendo -> http://${HOST}:${PORT}`)
})
