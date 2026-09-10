import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { users } from '../config/database.js'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '../config/env.js'
import { normalizePhone } from '../utils/phone.js'
import { msgVerificacaoTelefone } from '../services/whatsapp.services.js'
import { saveCode, deleteCode, generateCode, validateCode } from '../services/codeSending.service.js'

// Valida os dados e MANDA O CODIGO. Nao cria o usuario ainda — quem cria e
// o confirmarCadastro, depois que o codigo voltar certo. Se criasse aqui,
// o telefone nunca seria verificado de verdade.
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
            message: 'Telefone inválido. Tente novamente'
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

    if (searchResult !== null) {

        if (searchResult.user === user) {
            return response.status(409).json({
                message: 'Esse nome já está cadastrado. Escolha outro nome ou faça login!'
            })
        }

        return response.status(409).json({
            message: 'Esse telefone já está cadastrado. Faça login ou entre em contato com o suporte.'
        })

    }

    await deleteCode(phoneNormalizado)

    const { code, codeHash } = await generateCode()

    await saveCode(phoneNormalizado, codeHash)

    // Aqui o erro NAO pode ser engolido: sem a mensagem chegando, o usuario
    // fica esperando um codigo que nunca vem.
    try {
        await msgVerificacaoTelefone(phoneNormalizado, code)
    } catch (erro) {
        console.error('Falha ao enviar o código no WhatsApp:', erro)
        await deleteCode(phoneNormalizado)
        return response.status(400).json({
            message: 'Não conseguimos enviar o código para esse número. Confira se ele tem WhatsApp.'
        })
    }

    return response.status(200).json({
        message: 'Um código foi enviado para o seu WhatsApp.'
    })

}


// ==================================================================================================================================================================


// Segunda etapa: confere o codigo e so entao cria o usuario.
export async function confirmarCadastro(request: Request, response: Response) {

    const { user, password, phone, code } = request.body

    if (!user || !password || !phone || !code) {
        return response.status(400).json({
            message: 'Informe nome, telefone, senha e código.'
        })
    }

    const phoneNormalizado = normalizePhone(phone)

    if (!phoneNormalizado) {
        return response.status(400).json({
            message: 'Telefone inválido. Tente novamente'
        })
    }

    if (password.length < 8){
        return response.status(400).json({
            message: 'Sua senha contém menos que 8 caracteres.'
        })
    }

    const validate = await validateCode(phoneNormalizado, code)

    if (!validate.valid) {
        return response.status(400).json({
            message: validate.reason
        })
    }

    // Confere de novo: alguem pode ter cadastrado esse nome ou telefone
    // entre o pedido do codigo e a confirmacao.
    const searchResult = await users.findOne({
        $or: [{ user }, { phone: phoneNormalizado }]
    })

    if (searchResult !== null) {
        await deleteCode(phoneNormalizado)
        return response.status(409).json({
            message: 'Esse nome ou telefone já está cadastrado. Faça login!'
        })
    }

    const saltRounds = 10

    const hashPassword = await bcrypt.hash(password, saltRounds)

    await users.insertOne({user, role:'cliente', password: hashPassword, phone: phoneNormalizado})

    await deleteCode(phoneNormalizado)

    return response.status(201).json({
        message: 'Cadastro realizado!',
    })

}


// ==================================================================================================================================================================


export async function login(request: Request, response: Response) {
    
    const { userOrPhone, password } = request.body

    if (!userOrPhone || typeof userOrPhone !== 'string' || !password) {
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
