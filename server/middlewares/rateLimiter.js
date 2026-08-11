import rateLimit from 'express-rate-limit'

// General limiter — applies to most API routes
export const generalLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 150, // 150 requests per 5 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again in a few minutes.',
  },
  handler: (req, res) => {
    console.log('General rate limit hit:', req.ip)
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again in a few minutes.',
    })
  },
})

// Limiter for AI/image generation routes
export const aiToolLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 12, // 12 image generations per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You are generating images too quickly. Please wait a moment.',
  },
  handler: (req, res) => {
    console.log('AI tool rate limit hit:', req.ip)
    res.status(429).json({
      success: false,
      message: 'You are generating images too quickly. Please wait a moment.',
    })
  },
})

// Auth limiter — protects login/register routes
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // 20 attempts per 10 minutes
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only failed attempts count
  message: {
    success: false,
    message: 'Too many login attempts. Please wait 10 minutes and try again.',
  },
  handler: (req, res) => {
    console.log('Auth rate limit hit:', req.ip)
    res.status(429).json({
      success: false,
      message: 'Too many login attempts. Please wait 10 minutes and try again.',
    })
  },
})