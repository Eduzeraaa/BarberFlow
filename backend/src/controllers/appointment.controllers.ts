import type { Request, Response } from 'express'
import { agendamentos } from '../config/database.js'

export async function createAppointment(request: Request, response: Response) {
    const { user, service, barber, date, time } = request.body

    if (user == null || service === undefined || barber === undefined || date === undefined || time === undefined){
        response.json({
            message: 'Falta alguma informação! Confira novamente seu agendamento.',
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