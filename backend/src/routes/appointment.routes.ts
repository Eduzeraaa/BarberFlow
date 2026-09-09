import { Router } from 'express'
import { createAppointment, getAppointment, cancelAppointment, getMyAppointments, getBookedTimes, getHorarios } from '../controllers/appointment.controllers.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { verificarRole } from '../middleware/rbac.middleware.js'
import { defaultLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.post('/agendamento', defaultLimiter, verificarToken, createAppointment)
router.get('/buscarAgendamentos', defaultLimiter, verificarToken, verificarRole, getAppointment)
router.get('/horarios', defaultLimiter, verificarToken, getHorarios)
router.get('/horariosOcupados', defaultLimiter, verificarToken, getBookedTimes)
router.post('/cancelarAgendamento', defaultLimiter, verificarToken, cancelAppointment)
router.get('/meusAgendamentos', defaultLimiter, verificarToken, getMyAppointments)

export default router
