import { Sequelize } from 'sequelize'
import { DB_SQL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from './env.config.js'

export const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_SQL,
  logging: false
})

export const syncDB = async () => {
  try {
    await db.sync()
  } catch (error) {
    console.error(`No se pudo sincronizar con la bd: ${error}`)
    process.exit(1)
  }
}

export const testConnectDB = async () => {
  try {
    await db.authenticate()
  } catch (error) {
    console.error(`No se pudo conectar con la db: ${error}`)
    process.exit(1)
  }
}
