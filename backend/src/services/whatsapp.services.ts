import { WahaClient } from 'waha-node'
import { normalizePhone } from '../utils/phone.js'

const SESSAO = 'Barber-Flow'

function novoCliente() {
    return new WahaClient(
        `${process.env.WAHA_URL}`,
        `${process.env.WAHA_API_KEY}`
    )
}

// Traduz o telefone guardado no banco (5561999998888) para o chatId que o
// WhatsApp usa.
//
// Nao da para montar isso na mao: numeros brasileiros antigos estao
// registrados SEM o nono digito, e os novos COM. Em vez de chutar a regra,
// perguntamos ao WAHA e usamos o chatId que ele devolve.
async function paraChatId(phone: string) {

    const numero = normalizePhone(phone)

    if (!numero) {
        throw new Error(`Telefone invalido para o WhatsApp: ${phone}`)
    }

    const url = `${process.env.WAHA_URL}/api/contacts/check-exists?phone=${numero}&session=${SESSAO}`

    const resposta = await fetch(url, {
        headers: { 'X-Api-Key': `${process.env.WAHA_API_KEY}` }
    })

    if (resposta.ok) {
        const dados = await resposta.json() as { numberExists?: boolean, chatId?: string }

        if (dados.numberExists && dados.chatId) {
            return dados.chatId
        }

        throw new Error(`O numero ${numero} nao tem WhatsApp.`)
    }

    // WAHA fora do ar ou sessao caida: tenta o formato direto em vez de
    // desistir. Se estiver errado, o proprio sendText reclama.
    return `${numero}@c.us`

}


// ==================================================================================================================================================================


export async function whatsAppCancel(phone: string, barbeiro: string, date: string) {

    const chatId = await paraChatId(phone)

    await novoCliente().messages.sendText(
        SESSAO,
        chatId,
        `Olá! Seu horário com ${barbeiro} no dia ${date} foi cancelado.`
    )

}


// ==================================================================================================================================================================


export async function msgVerificacaoTelefone(phone: string, code: string) {

    const chatId = await paraChatId(phone)

    await novoCliente().messages.sendText(
        SESSAO,
        chatId,
        `Olá! Seu código do Barber Flow é ${code}. Ele vale por 10 minutos.`
    )

}
