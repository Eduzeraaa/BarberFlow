import { WahaClient } from 'waha-node'

export async function whatsAppCancel(phone:string, barbeiro:string, date:string) {
    
    const client = new WahaClient(
        `${process.env.WAHA_URL}`,
        `${process.env.WAHA_API_KEY}`
    )

    await client.messages.sendText(
        'Barber-Flow',
        `55${phone}@c.us`,
        `Olá! Seu horário com ${barbeiro} no dia ${date} foi cancelado.`
    )

}