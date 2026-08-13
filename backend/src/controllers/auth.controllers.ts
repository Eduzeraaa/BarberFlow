import type { Request, Response } from 'express'
import { users } from '../config/database.js'

export async function signup(request: Request, response: Response) {

    const {user, password, phone} = request.body

    const searchResult = await users.findOne({
        $or: [{ user }, { phone }]
    })
    
    if (searchResult === null){
        await users.insertOne({user, role:'cliente', password, phone})
        response.json({
            message: 'Cadastro realizado!',
        })
    }

    else if (searchResult.user === user) {
        response.json({
            message: 'Esse nome já está cadastrado. Escolha outro nome ou faça login!'
        })
    }

    else if (searchResult.phone === phone) {
        response.json({
            message: 'Esse telefone já está cadastrado. Faça login ou entre em contato com o suporte.'
        })
    }
}

export async function login(request: Request, response: Response) {
    const { userOrPhone, password } = request.body

    const searchResult = await users.findOne({
        $or: 
        [{ user: userOrPhone },{ phone: userOrPhone }],
        password: password
    })

    if (searchResult === null){
        response.json({
            message: 'Login ou senha incorretos.',
        })
    }

    else{
        response.json({
            message: 'Login efetuado com sucesso!',
            user: searchResult.user,
            role: searchResult.role,
            phone: searchResult.phone
        })
    }
}