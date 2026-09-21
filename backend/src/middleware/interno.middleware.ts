import type { NextFunction, Request, Response } from 'express'
import { INTERNAL_API_KEY } from '../config/env.js'

// Porteiro das rotas /interno/*. Em vez de cookie com JWT, exige o header
// X-Internal-Key com um segredo que so o agent conhece. O Express deixa os
// nomes de header em minusculo, por isso 'x-internal-key'.
export function verificarChaveInterna(request: Request, response: Response, next: NextFunction) {

    const chave = request.headers['x-internal-key']

    if (chave !== INTERNAL_API_KEY) {
        return response.status(401).json({ message: 'Chave interna inválida.' })
    }

    next()

}
