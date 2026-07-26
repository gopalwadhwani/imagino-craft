import express from 'express'
import { generateImage, getUserImages, deleteImage, removeBackground, compressImage , imagesToPdf, toggleFavorite} from '../controllers/imageController.js'
import userAuth from '../middlewares/auth.js'
import upload from '../middlewares/multer.js'

const imageRouter = express.Router()

imageRouter.post('/generate', userAuth, generateImage)
imageRouter.get('/history', userAuth, getUserImages)
imageRouter.post('/delete', userAuth, deleteImage)
imageRouter.post('/remove-bg', upload.single('image'), userAuth, removeBackground)
imageRouter.post('/compress', upload.single('image'), compressImage)
imageRouter.post('/to-pdf', upload.array('images', 10), imagesToPdf)
imageRouter.post('/favorite', userAuth, toggleFavorite)

export default imageRouter