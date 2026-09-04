import { Router } from 'express'
import { verificarToken } from '../middleware/auth.middleware.js'
import { defaultLimiter } from '../middleware/rateLimit.middleware.js'
import { allTheServices, createService } from '../controllers/service.controllers.js'
import { verificarRole } from '../middleware/rbac.middleware.js'

const router = Router()

router.get('/servicos', defaultLimiter, verificarToken, allTheServices)
router.post('/criarServico', defaultLimiter, verificarToken, verificarRole, createService)

export default router