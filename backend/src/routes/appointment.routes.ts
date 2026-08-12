import { Router } from 'express'
import { createAppointment, getAppointment, cancelAppointment } from '../controllers/appointment.controllers.js'

const router = Router()

router.post('/agendamento', createAppointment)
router.get('/buscarAgendamentos', getAppointment)
router.post('/cancelarAgendamento', cancelAppointment)

export default router
