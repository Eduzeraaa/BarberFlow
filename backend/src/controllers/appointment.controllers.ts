import type { Request, Response } from 'express'
import { agendamentos } from '../config/database.js'

export async function createAppointment(request: Request, response: Response) {
    const { user, service, barber, date, time } = request.body

    if (user === null || service === undefined || barber === undefined || date === undefined || time === undefined){
        response.json({
            message: 'Falta alguma informação! Confira novamente seu agendamento.',
        })
        return
    }

    const searchRequirements = await agendamentos.findOne({'time': time, 'date': date, 'barber': barber})


    if (searchRequirements !== null ){
        response.json({
            message: `${barber} está com o horário ocupado. Tente outro horário ou outro barbeiro!`
        })
        return
    }

    await agendamentos.insertOne({
        user,
        service,
        barber,
        date,
        time
    })

    response.json({
        message: `Agendamento realizado com sucesso! Nos vemos no dia ${date} às ${time}.`,
    })
}

export async function getAppointment(request: Request, response: Response) {
    const allAppointments = await agendamentos.find().toArray()
    
    response.json(allAppointments)
}