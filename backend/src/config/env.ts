import dotenv from 'dotenv'

dotenv.config()

const DB_CONN_STRING = process.env.DB_CONN_STRING

if (!DB_CONN_STRING) {
  throw new Error('DB_CONN_STRING is not defined')
}

const PORT = process.env.PORT

if (!PORT) {
  throw new Error('PORT is not defined')
}

const jwt_secret = process.env.JWT_SECRET

if (!jwt_secret) {
  throw new Error('JWT_SECRET is not defined')
}

export const url: string = DB_CONN_STRING

export const port: string = PORT

export const JWT_SECRET: string = jwt_secret