import dotenv from 'dotenv'
dotenv.config()

export const {
  // API
  HOST = 'localhost',
  PORT = '8000',
  // BD
  DB_SQL = 'mysql',
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'pizzeria',
  DB_USER = 'root',
  DB_PASSWORD = '',
  // JWT
  JWT_SECRET = 'MONT-27'
} = process.env
