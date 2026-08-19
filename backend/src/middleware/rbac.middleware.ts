import { NextFunction, Request, Response } from 'express'

export function verificarRole(request: Request, response: Response, next: NextFunction) {

    if (request.user?.role !== 'admin'){
        return response.status(403).json({ message: 'Acesso negado' })
    } 

    next()

}