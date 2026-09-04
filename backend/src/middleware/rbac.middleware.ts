import { NextFunction, Request, Response } from 'express'

export function verificarRole(request: Request, response: Response, next: NextFunction) {

    const admin = 'admin'
    const dev = 'dev'

    if (request.user?.role !== String(admin) && request.user?.role !== String(dev)){
        return response.status(403).json({ message: 'Acesso negado' })
    } 

    next()

}