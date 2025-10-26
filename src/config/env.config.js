import dotenv from 'dotenv'
dotenv.config()

export const {
  PORT = '8000',
  HOST = 'localhost'
} = process.env
