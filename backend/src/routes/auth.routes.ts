import { Router } from 'express'
import { signup, confirmarCadastro, login, getPerfil, logout, verificacaoRole } from '../controllers/auth.controllers.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { verificarRole } from '../middleware/rbac.middleware.js'
import { defaultLimiter, loginLimiter, signupLimiter } from '../middleware/rateLimit.middleware.js'

const router = Router()

router.post('/cadastro', signupLimiter, signup)
router.post('/cadastro/confirmar', signupLimiter, confirmarCadastro)
router.post('/login', loginLimiter, login)
router.post('/logout', defaultLimiter, verificarToken, logout)
router.get('/perfil', verificarToken, getPerfil)
router.get('/role', verificarToken, verificarRole, verificacaoRole)


export default router
