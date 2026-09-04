import type { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { agendamentos } from '../config/database.js'

const SERVICOS = ['Barba', 'Degradê', 'Social']
const BARBEIROS = ['José', 'Roberto', 'Cláudio']
const HORARIOS = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30']

export async function createAppointment(request: Request, response: Response) {
    const { service, barber, date, time } = request.body
    
    if (!request.user) {
        return response.status(401).json({ message: 'Não autenticado' })
    }

    const user = request.user?.user
    const phone = request.user?.phone

    if (service === undefined || barber === undefined || date === undefined || time === undefined || service === '' || barber === ''){
        response.status(400).json({
            message: 'Falta alguma informação! Confira novamente seu agendamento.',
        })
        return
    }

    if (!SERVICOS.includes(service)) {
        return response.status(400).json({ message: 'Não oferecemos esse serviço.' })
    }

    if (!BARBEIROS.includes(barber)) {
        return response.status(400).json({ message: 'Esse barbeiro não é nosso funcionário.' })
    }

    if (!HORARIOS.includes(time)) {
        return response.status(400).json({ message: 'Esse horário não está na nossa grade.' })
    }

    const agendamentoEm = new Date(`${date}T${time}:00-03:00`)

    if (Number.isNaN(agendamentoEm.getTime())) {
        return response.status(400).json({ message: 'Data inválida.' })
    }

    if (agendamentoEm.getTime() <= Date.now()) {
        return response.status(400).json({ message: 'Não dá para agendar em um horário que já passou.' })
    }

    const searchRequirements = await agendamentos.findOne({'time': time, 'date': date, 'barber': barber, 'status': true})


    if (searchRequirements !== null ){
        response.status(400).json({
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

    response.status(200).json({
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

    const ehCliente = appointment.phone === request.user.phone
    const ehBarbeiroDoHorario = appointment.barber === request.user.user

    if (!ehCliente && !ehBarbeiroDoHorario) {
        return response.status(403).json({ message: 'Você não pode cancelar este agendamento.' })
    }

    await agendamentos.updateOne(
        { _id: appointment._id },
        { $set: { status: false } }
    )

    return response.status(200).json({
        message: `Agendamento cancelado com sucesso!`
    })
}

export async function getMyAppointments(request: Request, response: Response) {

    if (!request.user?.phone) {
        return response.status(401).json({ message: 'Não autenticado' })
    }
    
    const phone = request.user.phone
    
    const myAppointments = await agendamentos.find({ phone }).toArray()

    response.status(200).json(myAppointments)

}