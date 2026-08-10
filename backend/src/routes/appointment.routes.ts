import { Router } from 'express'
import { createAppointment, getAppointment } from '../controllers/appointment.controllers.js'

const router = Router()

router.post('/agendamento', createAppointment)
router.get('/buscarAgendamentos', getAppointment)

export default router
