import rateLimit from 'express-rate-limit'

// General limiter — applies to most API routes
export const generalLimiter = rateLimit({
    windowMs: 2 * 60 * 1000, // 15 minutes
    max: 30, // 100 requests per window per IP
    message: { success: false, message: 'Too many requests. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// Stricter limiter for expensive AI/image operations
export const aiToolLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute per IP
    message: { success: false, message: 'You are sending requests too quickly. Please slow down.' },
    standardHeaders: true,
    legacyHeaders: false,
})

// Stricter limiter for auth routes (prevents brute-force login attempts)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // 10 attempts per window per IP
    message: { success: false, message: 'Too many attempts. Please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
})