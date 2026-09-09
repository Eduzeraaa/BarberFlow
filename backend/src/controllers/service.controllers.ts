import { Request, Response } from 'express'
import { services, agendamentos } from '../config/database.js'
import { normalizeService } from '../utils/service.js'
import { dataDeHoje } from '../utils/data.js'

export async function allTheServices(request: Request, response: Response){

    const SERVICOS = await services.find({active: true}).toArray()

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
    

    await services.insertOne({service: serviceNormalizado, active: true})

    return response.status(201).json({
        message: 'Serviço criado!'
    })
    
}

export async function deactivateService (request: Request, response: Response){

    const { service } = request.body

    if (typeof service !== 'string' || !service){
        return response.status(400).json({
            message: 'Insira o nome do serviço.'
        })
    }

    const searchResult = await services.findOne({ service })
    
    if (searchResult === null){
        return response.status(400).json({
            message: 'Esse serviço não existe.'
        })
    }

    if (searchResult.active === false){
        return response.status(400).json({
            message: 'O serviço já está desativado.'
        })
    }
    
    await services.updateOne(
        { service: service },
        { $set: { active: false } }
    )

    await agendamentos.updateMany(
        { service: service, status: true, date: { $gte: dataDeHoje() } },
        { $set: { status: false } }
    )
    
    return response.status(200).json({
        message: 'Serviço desativado com sucesso!'
    })

}