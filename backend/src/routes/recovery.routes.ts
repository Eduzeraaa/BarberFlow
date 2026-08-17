import { Router } from "express";
import { requestRecovery, resetPassword } from "../controllers/recovery.controllers.js";

const router = Router()

router.post('/recovery/request', requestRecovery)
router.post('/recovery/reset', resetPassword)

export default router