import { NextFunction, Request, Response } from 'express'
import { JWT_SECRET } from '../config/env.js'
import type { UserPayload } from '../types/express.js'
import jwt from 'jsonwebtoken'

export function verificarToken(request: Request, response: Response, next: NextFunction) {

    const token = request.cookies.token

    if (!token){
        return response.status(401).json({
            message: 'Token não encontrado'
        })
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as UserPayload
        request.user = decoded
        next()
    } catch (error) {
        return response.status(401).json({ message: 'Token inválido' })
    }

}