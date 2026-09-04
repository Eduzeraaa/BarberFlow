import { url } from './env.js'
import { MongoClient } from 'mongodb'
import type { User } from '../models/user.model.js'
import type { Agendamento } from '../models/appointment.model.js'
import type { Recovery } from '../models/passwordRecovery.model.js'
import type { Barbers } from '../models/barber.models.js'
import type { Service } from '../models/service.model.js'

const client = new MongoClient(url)

const database = client.db('barbearia')
export const users = database.collection<User>('users')
export const agendamentos = database.collection<Agendamento>('agendamentos')
export const recovery = database.collection<Recovery>('recovery')
export const barbers = database.collection<Barbers>('barbers')
export const services = database.collection<Service>('services')

export async function connectDatabase() {
    await client.connect()
    console.log('Conectado ao MongoDB!')
}
