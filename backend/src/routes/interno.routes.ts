import { Router } from 'express'
import { verificarChaveInterna } from '../middleware/interno.middleware.js'
import { defaultLimiter } from '../middleware/rateLimit.middleware.js'
import { allTheServices } from '../controllers/service.controllers.js'
import { allTheBarbers } from '../controllers/barber.controllers.js'
import { getHorarios, getBookedTimes } from '../controllers/appointment.controllers.js'
import { agendarInterno, cancelarInterno, meusAgendamentosInterno } from '../controllers/interno.controllers.js'

// Rotas para o agent do WhatsApp. Mesmo porteiro em todas: a chave interna.
//
// As de leitura reaproveitam os controllers do site — so muda quem barra na
// porta. As que precisam saber QUEM esta pedindo tem controller proprio,
// porque a identidade vem do body em vez do cookie.

const router = Router()

router.use('/interno', verificarChaveInterna)

router.get('/interno/servicos', defaultLimiter, allTheServices)
router.get('/interno/barbeiros', defaultLimiter, allTheBarbers)
router.get('/interno/horarios', defaultLimiter, getHorarios)
router.get('/interno/horariosOcupados', defaultLimiter, getBookedTimes)

router.get('/interno/meusAgendamentos', defaultLimiter, meusAgendamentosInterno)
router.post('/interno/agendamento', defaultLimiter, agendarInterno)
router.post('/interno/cancelarAgendamento', defaultLimiter, cancelarInterno)

export default router
