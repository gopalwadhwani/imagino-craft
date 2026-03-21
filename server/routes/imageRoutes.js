import express from 'express'
import { generateImage } from '../controllers/imageController.js'

const imageRouter = express.Router()

imageRouter.post('/generate', generateImage)

export default imageRouter