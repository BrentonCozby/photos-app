import express from 'express'
import { photoService } from '@/services'

const router = express.Router()

router.use('/photos', photoService.photosRouter)

export {
  router,
}