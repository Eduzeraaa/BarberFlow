import { Request, Response } from 'express'
import { services } from '../config/database.js'

export async function allTheServices(request: Request, response: Response){

    const SERVICOS = await services.find().toArray()

    return response.status(200).json(SERVICOS)

}

export async function createService(request: Request, response: Response){
    const { service } = request.body

    if (!service){
        return response.status(400).json({
            message: 'Insira o nome do novo serviço.'
        })
    }

    const searchResult = await services.findOne({service: service})

    if (searchResult !== null){
        return response.status(409).json({
            message: 'Já existe um serviço com esse nome.'
        })
    }

    else if (service.length < 2 ){
        return response.status(400).json({
            message: 'Um serviço precisa de no mínimo 2 caracteres.'
        })
    }

    await services.insertOne({service})

    return response.status(201).json({
        message: 'Serviço criado!'
    })
    
}