import { rateLimit } from 'express-rate-limit'

export const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 5,
    message: {message: 'Muitas tentativas. Tente novamente em alguns minutos.'}
})

export const signupLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 5,
    message: {message: 'Muitas tentativas. Tente novamente em alguns minutos.'}
})

export const recoveryLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minuto
    limit: 5,
    message: {message: 'Muitas tentativas. Tente novamente em alguns minutos.'}
})

export const defaultLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    message: {message: 'Muitas tentativas. Tente novamente em alguns minutos.'}
})

