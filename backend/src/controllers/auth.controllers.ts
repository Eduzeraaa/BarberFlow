import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import crypto from 'crypto'
import { barbers, users } from '../config/database.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { normalizePhone } from '../utils/phone.js'

export async function signup(request: Request, response: Response) {

    const {user, password, phone} = request.body

    if (!user || !password || !phone) {
        return response.status(400).json({
            message: 'Informe nome, telefone e senha.'
        })
    }

    const phoneNormalizado = normalizePhone(phone)

    if (!phoneNormalizado) {
        return response.status(400).json({
            message: 'Telefone inválido.'
        })
    }

    if (password.length < 8){
        return response.status(400).json({
            message: 'Sua senha contém menos que 8 caracteres.'
        })
    }

    const searchResult = await users.findOne({
        $or: [{ user }, { phone: phoneNormalizado }]
    })

    if (searchResult === null){

        const saltRounds = 10

        const hashPassword = await bcrypt.hash(password, saltRounds)

        await users.insertOne({user, role:'cliente', password: hashPassword, phone: phoneNormalizado})
        response.status(201).json({
            message: 'Cadastro realizado!',
        })
    }

    else if (searchResult.user === user) {
        response.status(409).json({
            message: 'Esse nome já está cadastrado. Escolha outro nome ou faça login!'
        })
    }

    else if (searchResult.phone === phoneNormalizado) {
        response.status(409).json({
            message: 'Esse telefone já está cadastrado. Faça login ou entre em contato com o suporte.'
        })
    }
}


// ==================================================================================================================================================================


export async function login(request: Request, response: Response) {
    
    const { userOrPhone, password } = request.body

    if (!userOrPhone || !password) {
        return response.status(400).json({
            message: 'Informe login e senha.'
        })
    }

    const phoneBusca = normalizePhone(userOrPhone)

    const buscaPor: object[] = [{ user: userOrPhone }]

    if (phoneBusca) {
        buscaPor.push({ phone: phoneBusca })
    }

    const searchResult = await users.findOne({ $or: buscaPor })
    
    if (searchResult === null) {
        return response.status(401).json({
            message: 'Login ou senha incorretos.',
        })
    }
    
    const passwordMatch = await bcrypt.compare(password, searchResult.password)
    
    if (!passwordMatch) {
        return response.status(401).json({
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
        secure: true,
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


// ==================================================================================================================================================================


export async function createAdmin (request:Request, response:Response){

    const {user, phone} = request.body

    if (!user || !phone) {
        return response.status(400).json({
            message: 'Informe nome e telefone.'
        })
    }

    const phoneNormalizado = normalizePhone(phone)

    if (!phoneNormalizado) {
        return response.status(400).json({
            message: 'Telefone inválido.'
        })
    }

    const searchResult = await users.findOne({
        $or: [{ user }, { phone: phoneNormalizado }]
    })

    if (searchResult === null){

        const randomPassword = String(crypto.randomInt(100000, 1000000))

        const saltRounds = 10

        const hashPassword = await bcrypt.hash(randomPassword, saltRounds)

        await users.insertOne({user, role:'admin', password: hashPassword, phone: phoneNormalizado})

        await barbers.insertOne({barber: user})

        response.status(201).json({
            message: 'Admin criado!',
        })
    }

    else if (searchResult.user === user) {
        response.status(409).json({
            message: 'Esse nome já está cadastrado. Escolha outro nome ou faça login!'
        })
    }

    else if (searchResult.phone === phoneNormalizado) {
        response.status(409).json({
            message: 'Esse telefone já está cadastrado. Faça login ou entre em contato com o suporte.'
        })
    }

}


// ==================================================================================================================================================================


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
