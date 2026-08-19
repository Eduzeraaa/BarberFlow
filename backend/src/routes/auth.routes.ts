import { Router } from 'express'
import { signup, login, getPerfil, logout, verificacaoRole } from '../controllers/auth.controllers.js'
import { verificarToken } from '../middleware/auth.middleware.js'
import { verificarRole } from '../middleware/rbac.middleware.js'

const router = Router()

router.post('/cadastro', signup)
router.post('/login', login)
router.post('/logout', verificarToken, logout)
router.get('/perfil', verificarToken, getPerfil)
router.get('/role', verificarToken, verificarRole, verificacaoRole)

export default router
