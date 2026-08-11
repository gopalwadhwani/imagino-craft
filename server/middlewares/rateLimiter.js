import rateLimit from 'express-rate-limit'

// General limiter — applies to most API routes
export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 150, // 150 requests per 5 minutes
  message: {
    success: false,
    message: 'Too many requests. Please try again in a few minutes.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Limiter for AI/image generation routes
export const aiToolLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 12, // 12 requests per minute
  message: {
    success: false,
    message: 'You are generating images too quickly. Please wait a moment.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})

// Auth limiter — prevents brute-force attacks
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 attempts per 10 minutes
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 10 minutes and try again.'
  },
  standardHeaders: true,
  legacyHeaders: false,
})