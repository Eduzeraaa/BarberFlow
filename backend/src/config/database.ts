import { url } from './env.js'
import { MongoClient } from 'mongodb'
import type { User } from '../models/user.model.js'
import type { Agendamento } from '../models/appointment.model.js'
import type { Recovery } from '../models/passwordRecovery.model.js'

const client = new MongoClient(url)

const database = client.db('barbearia')
export const users = database.collection<User>('users')
export const agendamentos = database.collection<Agendamento>('agendamentos')
export const recovery = database.collection<Recovery>('recovery')

export async function connectDatabase() {
    await client.connect()
    console.log('Conectado ao MongoDB!')
}
