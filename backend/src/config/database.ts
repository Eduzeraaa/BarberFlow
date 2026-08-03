import { url } from './env.js'
import { MongoClient } from 'mongodb'
import type { User } from '../models/user.model.js'
import type { Agendamento } from '../models/appointment.model.js'

const client = new MongoClient(url)

const database = client.db('barbearia')
export const users = database.collection<User>('users')
export const agendamentos = database.collection<Agendamento>('agendamentos')

export async function connectDatabase() {
    await client.connect()
    console.log('Conectado ao MongoDB!')
}
