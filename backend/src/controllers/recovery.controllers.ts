import type { Request, Response } from 'express'
import { users, recovery } from '../config/database.js'
import { sendSMS } from '../services/sms.service.js'
import { saveCode, deleteCode, generateCode, validateCode } from '../services/recovery.service.js'
import bcrypt from 'bcrypt'
import { normalizePhone } from '../utils/phone.js'

export async function requestRecovery(request: Request, response: Response)  {

    if (!request.body.phone) {
        return response.status(400).json({ success: false, message: 'Informe seu telefone.' })
    }

    const phone = normalizePhone(request.body.phone)

    if (!phone) {
        return response.status(400).json({ success: false, message: 'Telefone inválido.' })
    }

    const existingRequest = await recovery.findOne({ phone })

    if (existingRequest && existingRequest.newRequestAt > new Date()) {

        const msLeft = existingRequest.newRequestAt.getTime() - Date.now()
        const secondsLeft = Math.ceil(msLeft / 1000)

        return response.status(429).json({ 
            success: false,
            message: `Aguarde ${secondsLeft} segundos`,
            cooldownSeconds: secondsLeft 

        })
    
    }

    const searchResult = await users.findOne({phone})

    if (searchResult === null){
        return response.status(400).json({
            success: false,
            message: 'Este número não está cadastrado. Verifique se o número está correto.'
        })
    }

    await deleteCode(phone)

    const { code, codeHash } = await generateCode()

    await saveCode(phone, codeHash)

    await sendSMS(phone, code)

    response.status(200).json({
        success: true,
        message: 'Um código será enviado para o seu telefone via SMS!'
    })

}

export async function resetPassword(request: Request, response: Response) {
    // recebe phone + code + newPassword do frontend

    const {code, newPassword, confirmNewPassword} = request.body

    if (!request.body.phone) {
        return response.status(400).json({ success: false, message: 'Informe seu telefone.' })
    }

    // mesma normalização do requestRecovery: o código foi salvo sob a
    // forma só-dígitos, então a validação precisa buscar por ela
    const phone = normalizePhone(request.body.phone)

    // validateCode()

    const validate = await validateCode(phone, code)

    // se válido, atualiza senha no banco

    if (!validate.valid) {
        return response.status(400).json({
            success: false,
            message: validate.reason
        })
    }

    if (newPassword.length < 8) {
        return response.status(400).json({
            success: false,
            message: 'Senha deve ter no mínimo 8 caracteres.'
        })
    }

if (newPassword !== confirmNewPassword) {
    return response.status(400).json({
        success: false,
        message: 'As senhas são diferentes.'
    })
}

    const saltRounds = 10
    const hashPassword = await bcrypt.hash(newPassword, saltRounds)

    await users.updateOne(
        {phone},
        {$set: {password: hashPassword}}
    )

    await deleteCode(phone)

    response.status(200).json({
        success: true,
        message: 'Senha alterada com sucesso!'
    })

}