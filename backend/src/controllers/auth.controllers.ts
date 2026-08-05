import type { Request, Response } from 'express'
import { users } from '../config/database.js'

export async function signup(request: Request, response: Response) {

    const {user, password} = request.body

    const searchResult = await users.findOne({user})
    
    if (searchResult === null){
        await users.insertOne({user, password})
        response.json({
            message: 'Cadastro realizado!',
        })
    }

    else{
        response.json({
            message: 'Já existe um usuário com este nome. Tente outro por favor!'
        })
    }
}

export async function login(request: Request, response: Response) {
    const {user, password} = request.body

    const searchResult = await users.findOne({user, password})

    if (searchResult === null){
        response.json({
            message: 'Usuário ou senha incorretos.',
        })
    }

    else{
        response.json({
            message: 'Login efetuado com sucesso!',
            user: searchResult.user,
        })
    }
}

