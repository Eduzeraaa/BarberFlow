import { ObjectId } from 'mongodb'
import { agendamentos, barbers, services } from '../config/database.js'
import { HORARIOS } from '../config/horarios.js'
import { whatsAppCancel } from './whatsapp.services.js'

// Regra de negocio de agendamento, sem nada de HTTP. Quem chama (site ou
// agent) decide de onde vem o usuario; aqui so se valida e grava.
//
// Devolve { status, message } e o controller repassa como resposta.

type Resultado = { status: number, message: string }

type DadosAgendar = {
    user: string
    phone: string
    service: string
    barber: string
    date: string
    time: string
}

export async function agendar({ user, phone, service, barber, date, time }: DadosAgendar): Promise<Resultado> {

    if (!service || !barber || !date || !time) {
        return { status: 400, message: 'Falta alguma informação! Confira novamente seu agendamento.' }
    }

    const servicoAtivo = await services.findOne({ service, active: true })

    if (servicoAtivo === null) {
        return { status: 400, message: 'Não oferecemos esse serviço.' }
    }

    const barbeiroAtivo = await barbers.findOne({ barber, active: true })

    if (barbeiroAtivo === null) {
        return { status: 400, message: 'Esse barbeiro não é nosso funcionário.' }
    }

    if (!HORARIOS.includes(time)) {
        return { status: 400, message: 'Esse horário não está na nossa grade.' }
    }

    const agendamentoEm = new Date(`${date}T${time}:00-03:00`)

    if (Number.isNaN(agendamentoEm.getTime())) {
        return { status: 400, message: 'Data inválida.' }
    }

    if (agendamentoEm.getTime() <= Date.now()) {
        return { status: 400, message: 'Não dá para agendar em um horário que já passou.' }
    }

    const ocupado = await agendamentos.findOne({ time, date, barber, status: true })

    if (ocupado !== null) {
        return { status: 400, message: `${barber} está com o horário ocupado. Tente outro horário ou outro barbeiro!` }
    }

    await agendamentos.insertOne({ user, phone, service, barber, date, time, status: true })

    return { status: 200, message: `Agendamento realizado com sucesso! Nos vemos no dia ${date} às ${time}.` }

}


// ==================================================================================================================================================================


type DadosCancelar = {
    id: string
    user: string
    phone: string
    role: string
}

export async function cancelar({ id, user, phone, role }: DadosCancelar): Promise<Resultado> {

    if (!ObjectId.isValid(id)) {
        return { status: 400, message: 'Agendamento inválido.' }
    }

    const appointment = await agendamentos.findOne({ _id: new ObjectId(id) })

    if (appointment === null) {
        return { status: 404, message: 'Agendamento não encontrado.' }
    }

    const ehCliente = appointment.phone === phone
    const ehBarbeiroDoHorario = appointment.barber === user

    if (!ehCliente && !ehBarbeiroDoHorario && role !== 'dev') {
        return { status: 403, message: 'Você não pode cancelar este agendamento.' }
    }

    await agendamentos.updateOne(
        { _id: appointment._id },
        { $set: { status: false } }
    )

    if (ehBarbeiroDoHorario) {
        try {
            await whatsAppCancel(appointment.phone, appointment.barber, appointment.date)
        } catch (erro) {
            console.error('Falha ao avisar o cliente no WhatsApp:', erro)
        }
    }

    return { status: 200, message: 'Agendamento cancelado com sucesso!' }

}
