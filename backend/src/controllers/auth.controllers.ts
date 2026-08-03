import type { Request, Response } from 'express'
import { users } from '../config/database.js'

export async function signup(request: Request, response: Response) {
    const {username, password} = request.body

    const insertResult = await users.insertOne({username, password})

    response.json({
        message: 'Cadastro realizado!',
    })
}

export async function login(request: Request, response: Response) {
    const {username, password} = request.body

    const searchResult = await users.findOne({username, password})

    if (searchResult === null){
        response.json({
            message: 'Usuário ou senha incorretos.',
        })
    }

    else{
        response.json({
            message: 'Login efetuado com sucesso!',
        })
    }
}
