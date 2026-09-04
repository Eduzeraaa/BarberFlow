import { Router } from 'express'
import { verificarToken } from '../middleware/auth.middleware.js'
import { defaultLimiter } from '../middleware/rateLimit.middleware.js'
import { allTheBarbers } from '../controllers/barber.controllers.js'

const router = Router()

router.get('/barbeiros', defaultLimiter, verificarToken, allTheBarbers)

export default router