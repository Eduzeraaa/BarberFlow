const TEXTBEE_API_KEY = process.env.TEXTBEE_API_KEY
const TEXTBEE_DEVICE_ID = process.env.TEXTBEE_DEVICE_ID

export async function sendSMS(phone: string, code: string) {

    if (!TEXTBEE_API_KEY || !TEXTBEE_DEVICE_ID) {
        throw new Error('TextBee credentials are not defined')
    }

    const message = `Olá. Seu código de recuperação de senha do BarberFlow é ${code}.`

    const response = await fetch(
        `https://api.textbee.dev/api/v1/gateway/devices/${TEXTBEE_DEVICE_ID}/send-sms`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': TEXTBEE_API_KEY
            },
            body: JSON.stringify({
                recipients: [phone],
                message
            })
        }
    )

    if (!response.ok) {
        throw new Error('Erro ao enviar SMS')
    }

    return response.json()
}