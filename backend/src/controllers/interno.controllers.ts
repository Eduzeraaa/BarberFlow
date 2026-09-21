import type { Request, Response } from 'express'
import { agendamentos, users } from '../config/database.js'
import { agendar, cancelar } from '../services/appointment.service.js'
import { normalizePhone } from '../utils/phone.js'

// Controllers das rotas /interno/*, usadas pelo agent do WhatsApp.
//
// A diferenca para os controllers do site: a identidade nao vem do cookie
// (request.user), vem do campo "phone" no body — que o agent preenche com o
// numero do remetente da mensagem, ja traduzido do LID.

async function usuarioPeloTelefone(phoneCru: unknown) {
    if (typeof phoneCru !== 'string') return null

    const phone = normalizePhone(phoneCru)
    if (!phone) return null

    return users.findOne({ phone })
}


// ==================================================================================================================================================================


export async function agendarInterno(request: Request, response: Response) {

    const usuario = await usuarioPeloTelefone(request.body.phone)

    if (usuario === null) {
        return response.status(404).json({ message: 'Esse telefone não está cadastrado.' })
    }

    const { service, barber, date, time } = request.body

    const resultado = await agendar({
        user: usuario.user,
        phone: usuario.phone,
        service, barber, date, time
    })

    return response.status(resultado.status).json({ message: resultado.message })

}


// ==================================================================================================================================================================


export async function cancelarInterno(request: Request, response: Response) {

    const usuario = await usuarioPeloTelefone(request.body.phone)

    if (usuario === null) {
        return response.status(404).json({ message: 'Esse telefone não está cadastrado.' })
    }

    const resultado = await cancelar({
        id: request.body.id,
        user: usuario.user,
        phone: usuario.phone,
        role: usuario.role
    })

    return response.status(resultado.status).json({ message: resultado.message })

}


// ==================================================================================================================================================================


export async function meusAgendamentosInterno(request: Request, response: Response) {

    const usuario = await usuarioPeloTelefone(request.query.phone)

    if (usuario === null) {
        return response.status(404).json({ message: 'Esse telefone não está cadastrado.' })
    }

    const meus = await agendamentos.find({ phone: usuario.phone, status: true }).toArray()

    return response.status(200).json(meus)

}
