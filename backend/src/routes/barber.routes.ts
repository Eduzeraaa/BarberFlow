import { Router } from 'express'
import { verificarToken } from '../middleware/auth.middleware.js'
import { defaultLimiter } from '../middleware/rateLimit.middleware.js'
import { allTheBarbers, createBarber, deactivateBarber } from '../controllers/barber.controllers.js'
import { verificarRole } from '../middleware/rbac.middleware.js'

const router = Router()

router.get('/barbeiros', defaultLimiter, verificarToken, allTheBarbers)
router.post('/criarBarber', defaultLimiter, verificarToken, verificarRole, createBarber)
router.post('/excluirBarber', defaultLimiter, verificarToken, verificarRole, deactivateBarber)

export default router