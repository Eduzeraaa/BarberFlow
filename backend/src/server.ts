import express from "express";
import dotenv from 'dotenv'
import { MongoClient } from "mongodb";

dotenv.config()

const url = process.env.DB_CONN_STRING

if (!url) {
  throw new Error('DB_CONN_STRING is not defined') // tive que fazer isso pq o typescript não tinha certeza se a variável de ambiente existia ou nao
}

interface User {
    username: string,
    password: string,
}

interface Agendamento {
    service: string
    barber: string
    date: string
    time: string
}

const client = new MongoClient(url)

const database = client.db('barbearia')
const users = database.collection<User>('users')
const agendamentos = database.collection<Agendamento>('agendamentos')

await client.connect()
const app = express()
const port = 3000

app.use(express.json())

app.post('/cadastro', async (request, response) => {

    const {username, password} = request.body // desestruturação
    // mesma coisa q fazer isso:
    // const user = request.body.user
    // const password = request.body.passwrod

    const insertResult = await users.insertOne({username, password})

    response.json({
        message: 'Cadastro realizado!',
        //result: insertResult
    })

})

app.post('/login', async (request, response) => {

    const {username, password} = request.body

    const searchResult = await users.findOne({username, password})

    if (searchResult === null){
        response.json({
            message: 'Usuário ou senha incorretos.',
            //result: searchResult
        })
    }

    else{
        response.json({
            message: 'Login efetuado com sucesso!',
            //result: searchResult
        })
    }
})

app.post('/agendamento', async (request, response) => {

    const {service, barber, date, time} = request.body

    
    if (service === undefined || barber === undefined || date === undefined || time === undefined){
        response.json({
            message: 'Falta alguma informação! Confira novamente seu agendamento.',
        })
    }
    
    else {

        const insertResult = await agendamentos.insertOne({
            service,
            barber,
            date,
            time
        })
        
        response.json({
            message: `Agendamento realizado com sucesso! Nos vemos no dia ${date} às ${time}.`,
            result: insertResult
        })
    }

})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})