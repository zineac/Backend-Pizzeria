import dotenv from 'dotenv'
dotenv.config()

export const {
  // API
  HOST = '0.0.0.0',
  PORT = '8000',
  // BD
  DB_SQL = 'mysql',
  DB_HOST = 'localhost',
  DB_PORT = '3306',
  DB_NAME = 'pizzeria',
  DB_USER = 'root',
  DB_PASSWORD = '',
  // JWT
  JWT_SECRET = 'MONT-27',
  // MERCADO PAGO
  MP_ACCESS_TOKEN = '',
  FRONTEND_URL = '',
  NOTIFICATION_URL = ''
} = process.env
