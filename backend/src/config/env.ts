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


const ORIGIN = process.env.ORIGIN

if (!ORIGIN) {
  throw new Error('ORIGIN is not defined')
}


const internal_api_key = process.env.INTERNAL_API_KEY

if (!internal_api_key) {
  throw new Error('INTERNAL_API_KEY is not defined')
}


export const INTERNAL_API_KEY: string = internal_api_key

export const origin: string = ORIGIN

export const url: string = DB_CONN_STRING

export const port: string = PORT

export const JWT_SECRET: string = jwt_secret