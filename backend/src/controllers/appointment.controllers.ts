import type { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { agendamentos } from '../config/database.js'

export async function createAppointment(request: Request, response: Response) {
    const { service, barber, date, time } = request.body
    
    if (!request.user) {
        return response.status(401).json({ message: 'Não autenticado' })
    }

    const user = request.user?.user
    const phone = request.user?.phone

    if (service === undefined || barber === undefined || date === undefined || time === undefined || service === '' || barber === ''){
        response.json({
            message: 'Falta alguma informação! Confira novamente seu agendamento.',
        })
        return
    }

    const searchRequirements = await agendamentos.findOne({'time': time, 'date': date, 'barber': barber, 'status': true})


    if (searchRequirements !== null ){
        response.json({
            message: `${barber} está com o horário ocupado. Tente outro horário ou outro barbeiro!`
        })
        return
    }

    await agendamentos.insertOne({
        user,
        phone,
        service,
        barber,
        date,
        time,
        status: true
    })

    response.json({
        message: `Agendamento realizado com sucesso! Nos vemos no dia ${date} às ${time}.`,
    })
}

export async function getAppointment(request: Request, response: Response) {
    const allAppointments = await agendamentos.find().toArray()

    response.json(allAppointments)
}

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

export async function cancelAppointment(request: Request, response: Response) {
    const { id } = request.body

    if (!request.user) {
        return response.status(401).json({ message: 'Não autenticado' })
    }

    if (!ObjectId.isValid(id)) {
        return response.status(400).json({ message: 'Agendamento inválido.' })
    }

    const appointment = await agendamentos.findOne({ _id: new ObjectId(id) })

    if (appointment === null) {
        return response.status(404).json({ message: 'Agendamento não encontrado.' })
    }

    const ehAdmin = request.user.role === 'admin'
    const ehDono = appointment.phone === request.user.phone

    if (!ehAdmin && !ehDono) {
        return response.status(403).json({ message: 'Você só pode cancelar os seus agendamentos.' })
    }

    await agendamentos.updateOne(
        { _id: appointment._id },
        { $set: { status: false } }
    )

    return response.json({
        message: `Agendamento cancelado com sucesso!`
    })
}

export async function getMyAppointments(request: Request, response: Response) {

    if (!request.user?.phone) {
        return response.status(401).json({ message: 'Não autenticado' })
    }
    
    const phone = request.user.phone
    
    const myAppointments = await agendamentos.find({ phone }).toArray()

    response.json(myAppointments)

}