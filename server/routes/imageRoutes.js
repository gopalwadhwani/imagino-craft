import express from 'express'
import { generateImage, getUserImages, deleteImage } from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'

const imageRouter = express.Router()

imageRouter.post('/generate', userAuth, generateImage)
imageRouter.get('/history', userAuth, getUserImages)
imageRouter.post('/delete', userAuth, deleteImage)

export default imageRouter