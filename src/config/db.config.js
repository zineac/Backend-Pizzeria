import { Sequelize } from 'sequelize'
import { DB_SQL, DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD } from './env.config.js'

export const db = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_SQL,
  logging: false
})

export const initDB = async () => {
  try {
    await createDB()
    await connectDB()
    await syncDB()
  } catch (error) {
    throw new Error(`Error al inicializar la bd -> ${error.message}`)
  }
}

const createDB = async () => {
  let temp
  try {
    temp = new Sequelize('', DB_USER, DB_PASSWORD, {
      host: DB_HOST,
      port: DB_PORT,
      dialect: DB_SQL,
      logging: false
    })
    await temp.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`)
    await temp.close()
  } catch (error) {
    throw new Error(`No se pudo crear: ${error.message}`)
  } finally {
    if (temp) await temp.close()
  }
}

const connectDB = async () => {
  try {
    await db.authenticate()
  } catch (error) {
    throw new Error(`No se pudo conectar: ${error.message}`)
  }
}

const syncDB = async () => {
  try {
    await db.sync()
  } catch (error) {
    throw new Error(`No se pudo sincronizar: ${error.message}`)
  }
}
