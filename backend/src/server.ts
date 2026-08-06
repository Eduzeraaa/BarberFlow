import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/database.js'
import authRoutes from './routes/auth.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'
import { port } from './config/env.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(authRoutes)
app.use(appointmentRoutes)

async function start() {
    await connectDatabase()

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
}

start()
