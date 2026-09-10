// Formato unico de telefone no sistema: 55 + DDD + numero, so digitos.
// Ex.: "(61) 99999-8888" -> "5561999998888"
//
// Isto e o formato de ARMAZENAMENTO. O formato do WhatsApp (chatId) e
// outro, e fica no whatsapp.services.ts — sao conversoes diferentes.
//
// Devolve string vazia quando o telefone nao e valido, para que os
// controllers possam testar com if (!phoneNormalizado).
export function normalizePhone(phone: string) {

    const digits = String(phone ?? '').replace(/\D/g, '')

    // Tira o 55 se o usuario ja digitou, para nao duplicar no final.
    const semPais = digits.startsWith('55') ? digits.slice(2) : digits

    // DDD (2) + numero (8 fixo ou 9 celular)
    if (semPais.length < 10 || semPais.length > 11) {
        return ''
    }

    return `55${semPais}`

}
