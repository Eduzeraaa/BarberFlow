import * as crypto from 'crypto'
import { recovery } from '../config/database.js'
import bcrypt from 'bcrypt'


// cria código aleatório de 6 dígitos

export async function generateCode() {

    const code = String(crypto.randomInt(100000, 1000000)) 

    const codeHash = await bcrypt.hash(code, 10) 

    return { code, codeHash }

}

//salva no banco com validade

export async function saveCode (phone: string, codeHash: string) {

    const expiresAt = new Date(
        Date.now() + 10 * 60 * 1000
    )

    const newRequestAt = new Date(
        Date.now() + 3 * 60 * 1000
    )

    await recovery.insertOne({
        phone,
        codeHash,
        expiresAt,
        newRequestAt,
        attempts: 0
    })

}

//verifica se código existe e não expirou

export async function validateCode(phone: string, code: string) {

    const searchResult = await recovery.findOne({ phone })

    if (!searchResult) { // existencia
        return {valid: false, reason: 'telefone não existe'}
    }

    if (new Date() > searchResult.expiresAt) { // expirou
        return {valid: false, reason: 'código expirou'}
    }

    if (searchResult.attempts >= 3) { // tentativas
        return {valid: false, reason: 'muitas tentativas. Solicite um novo código.'}
    }

    const codeMatches = await bcrypt.compare(code, searchResult.codeHash) // comparacao de codigo enviado com codigo criado

    if (!codeMatches) {
        await recovery.updateOne({ phone }, { $inc: { attempts: 1 } })

        const remainingAttempts = 3 - (searchResult.attempts + 1)
        return {valid: false, reason: `Código errado. ${remainingAttempts} tentativas restantes.`}
    }

    return {valid: true, reason: 'success'}
}



//remove após usar

export async function deleteCode(phone: string) {

    await recovery.deleteOne({ phone })

}