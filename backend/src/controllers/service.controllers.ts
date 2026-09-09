import { Request, Response } from 'express'
import { services } from '../config/database.js'
import { normalizeService } from '../utils/service.js'

export async function allTheServices(request: Request, response: Response){

    const SERVICOS = await services.find().toArray()

    return response.status(200).json(SERVICOS)

}

export async function createService(request: Request, response: Response){
    const { service } = request.body
    
    if (typeof service !== 'string' || !service){
        return response.status(400).json({
            message: 'Insira o nome do novo serviço.'
        })
    }
    
    const serviceNormalizado = normalizeService(service)
    
    if (serviceNormalizado.length < 2 ){
        return response.status(400).json({
            message: 'Um serviço precisa de no mínimo 2 caracteres.'
        })
    }
    
    const searchResult = await services.findOne({service: serviceNormalizado})
    
    if (searchResult !== null){
        return response.status(409).json({
            message: 'Já existe um serviço com esse nome.'
        })
    }
    

    await services.insertOne({service: serviceNormalizado})

    return response.status(201).json({
        message: 'Serviço criado!'
    })
    
}