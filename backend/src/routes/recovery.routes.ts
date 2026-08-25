import { Router } from "express";
import { requestRecovery, resetPassword } from "../controllers/recovery.controllers.js";
import { defaultLimiter, recoveryLimiter } from "../middleware/rateLimit.middleware.js";

const router = Router()

router.post('/recovery/request', recoveryLimiter, requestRecovery)
router.post('/recovery/reset', defaultLimiter, resetPassword)

export default router