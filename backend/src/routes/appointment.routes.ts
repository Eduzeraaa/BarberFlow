import { Router } from 'express'
import { createAppointment, getAppointment, cancelAppointment, getMyAppointments } from '../controllers/appointment.controllers.js'
import { verificarToken } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/agendamento', verificarToken, createAppointment)
router.get('/buscarAgendamentos', verificarToken, getAppointment)
router.post('/cancelarAgendamento', verificarToken, cancelAppointment)
router.get('/meusAgendamentos', verificarToken, getMyAppointments)

export default router
