import type { Request, Response } from 'express'
import { barbers, users, agendamentos } from "../config/database.js"
import crypto from 'crypto'
import bcrypt from 'bcrypt'
import { normalizePhone } from '../utils/phone.js'
import { dataDeHoje } from '../utils/data.js'

export async function allTheBarbers(request: Request, response: Response) {

    const BARBEIROS = await barbers.find({active: true}).toArray()

    return response.status(200).json(BARBEIROS)

}

// ==================================================================================================================================================================


export async function createBarber (request:Request, response:Response){

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

        await barbers.insertOne({barber: user, active: true})

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

export async function deactivateBarber (request: Request, response: Response){

    const { barber } = request.body

    if (typeof barber !== 'string' || !barber){
        return response.status(400).json({
            message: 'Insira o nome do barbeiro.'
        })
    }

    const searchResult = await barbers.findOne({ barber })

    if (searchResult === null){
        return response.status(400).json({
            message: 'Esse barbeiro não existe.'
        })
    }

    if (searchResult.active === false){
        return response.status(400).json({
            message: 'O barbeiro já está desativado.'
        })
    }

    await barbers.updateOne(
        { barber: barber },
        { $set: { active: false } }
    )

    await agendamentos.updateMany(
        { barber: barber, status: true, date: { $gte: dataDeHoje() } },
        { $set: { status: false } }
    )

    return response.status(200).json({
        message: 'Barbeiro desativado com sucesso!'
    })


}