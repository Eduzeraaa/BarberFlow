import { JwtPayload } from 'jsonwebtoken'

export type UserPayload = {
    user: string
    role: string
    phone: string
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload
    }
  }
}