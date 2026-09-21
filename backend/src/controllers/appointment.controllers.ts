import type { Request, Response } from 'express'
import { agendamentos } from '../config/database.js'
import { HORARIOS } from '../config/horarios.js'
import { agendar, cancelar } from '../services/appointment.service.js'

export async function getHorarios(request: Request, response: Response) {
    response.status(200).json(HORARIOS)
}



// ==================================================================================================================================================================



export async function createAppointment(request: Request, response: Response) {

    if (!request.user) {
        return response.status(401).json({ message: 'Não autenticado' })
    }

    const { service, barber, date, time } = request.body

    const resultado = await agendar({
        user: request.user.user,
        phone: request.user.phone,
        service, barber, date, time
    })

    return response.status(resultado.status).json({ message: resultado.message })
}


// ==================================================================================================================================================================


export async function getAppointment(request: Request, response: Response) {
    const allAppointments = await agendamentos.find().toArray()

    response.json(allAppointments)
}


// ==================================================================================================================================================================



export async function getBookedTimes(request: Request, response: Response) {
    const barber = request.query.barber
    const date = request.query.date

    if (typeof barber !== 'string' || typeof date !== 'string') {
        return response.status(400).json({ message: 'Informe o barbeiro e a data.' })
    }

    const ocupados = await agendamentos.find({ barber, date, status: true }).toArray()

    response.json({
        times: ocupados.map((agendamento) => agendamento.time)
    })
}


// ==================================================================================================================================================================



export async function cancelAppointment(request: Request, response: Response) {

    if (!request.user) {
        return response.status(401).json({ message: 'Não autenticado' })
    }

    const resultado = await cancelar({
        id: request.body.id,
        user: request.user.user,
        phone: request.user.phone,
        role: request.user.role
    })

    return response.status(resultado.status).json({ message: resultado.message })
}


// ==================================================================================================================================================================


export async function getMyAppointments(request: Request, response: Response) {

    if (!request.user?.phone) {
        return response.status(401).json({ message: 'Não autenticado' })
    }
    
    const phone = request.user.phone
    
    const myAppointments = await agendamentos.find({ phone }).toArray()

    response.status(200).json(myAppointments)

}