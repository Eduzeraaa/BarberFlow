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

const client = new MongoClient(url)

const database = client.db('users')
const collection = database.collection<User>('users')

await client.connect()
const app = express()
const port = 3000

app.use(express.json())

app.post('/login', async (request, response) => {

    const {user, password} = request.body

    const insertResult = await collection.insertOne({username: user, password: password})

    response.json({
        message: 'Cadastro realizado!',
        result: insertResult
    })

})

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
})