import { Router } from 'express'
import { createAppointment } from '../controllers/appointment.controllers.js'

const router = Router()

router.post('/agendamento', createAppointment)

export default router
