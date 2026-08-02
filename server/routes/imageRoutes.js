import express from 'express'
import { generateImage, getUserImages, deleteImage, removeBackground, compressImage, imagesToPdf, toggleFavorite, startEditSession, sendEditMessage, getEditSession, startEditSessionFromPrompt } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'
import upload from '../middlewares/multer.js'
import { aiToolLimiter } from '../middlewares/rateLimiter.js'

const imageRouter = express.Router()

imageRouter.post('/generate', aiToolLimiter, userAuth, generateImage)
imageRouter.get('/history', userAuth, getUserImages)
imageRouter.post('/delete', userAuth, deleteImage)
imageRouter.post('/remove-bg', aiToolLimiter, upload.single('image'), userAuth, removeBackground)
imageRouter.post('/compress', upload.single('image'), compressImage)
imageRouter.post('/to-pdf', upload.array('images', 10), imagesToPdf)
imageRouter.post('/favorite', userAuth, toggleFavorite)
imageRouter.post('/edit/start', aiToolLimiter, upload.single('image'), userAuth, startEditSession)
imageRouter.post('/edit/message', aiToolLimiter, userAuth, sendEditMessage)
imageRouter.get('/edit/:sessionId', userAuth, getEditSession)
imageRouter.post('/edit/start-from-prompt', aiToolLimiter, userAuth, startEditSessionFromPrompt)

export default imageRouter