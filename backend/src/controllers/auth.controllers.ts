import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { users } from '../config/database.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'

export async function signup(request: Request, response: Response) {

    const {user, password, phone} = request.body

    if (!user || !password || !phone) {
        return response.json({
            message: 'Informe nome, telefone e senha.'
        })
    }

    const searchResult = await users.findOne({
        $or: [{ user }, { phone }]
    })

    if (searchResult === null){

        const saltRounds = 10

        const hashPassword = await bcrypt.hash(password, saltRounds)

        await users.insertOne({user, role:'cliente', password: hashPassword, phone})
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
        $or: [{ user: userOrPhone }, { phone: userOrPhone }]
    })
    
    if (searchResult === null) {
        return response.json({
            message: 'Login ou senha incorretos.',
        })
    }
    
    const passwordMatch = await bcrypt.compare(password, searchResult.password)
    
    if (!passwordMatch) {
        return response.json({
            message: 'Login ou senha incorretos.',
        })
    }
    
    const token = jwt.sign(
        { user: searchResult.user, role: searchResult.role, phone: searchResult.phone},
        JWT_SECRET,
        {expiresIn: '7d'}
    )

    response.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })

    response.json({
        message: 'Login efetuado com sucesso!',
        user: searchResult.user,
        role: searchResult.role,
        phone: searchResult.phone
    })
}

export function logout (request: Request, response: Response) {

    response.clearCookie('token')

    return response.json({
        message: 'Logout realizado com sucesso!'
    })

}

export function verificacaoRole (request: Request, response: Response) {

    return response.json({
        message: 'Acesso permitido'
    })

}

export function getPerfil(request: Request, response: Response) {
    response.json({
        message: 'Perfil do usuário',
        data: request.user
    })
}
