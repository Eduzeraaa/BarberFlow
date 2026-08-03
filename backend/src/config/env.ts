import dotenv from 'dotenv'

dotenv.config()

const DB_CONN_STRING = process.env.DB_CONN_STRING

if (!DB_CONN_STRING) {
  throw new Error('DB_CONN_STRING is not defined')
}

export const url: string = DB_CONN_STRING