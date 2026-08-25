import express from 'express'
import cors from 'cors'
import { connectDatabase } from './config/database.js'
import authRoutes from './routes/auth.routes.js'
import appointmentRoutes from './routes/appointment.routes.js'
import smsRoutes from './routes/recovery.routes.js'
import { origin, port } from './config/env.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors({
    origin: origin, 
    credentials: true
}))
app.use(express.json())
app.use(cookieParser())
app.use(authRoutes)
app.use(appointmentRoutes)
app.use(smsRoutes)

async function start() {
    await connectDatabase()

    app.listen(port, () => {
        console.log(`Servidor rodando na porta ${port}`)
    })
}

start()
