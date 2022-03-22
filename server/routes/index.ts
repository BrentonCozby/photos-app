import express from 'express'
import * as photos from '@/controllers/photos'

const router = express.Router()

router.get('/photos', photos.getMany)
router.get('/photos/:id', photos.getOne)
router.post('/photos', photos.post)
router.patch('/photos/:id', photos.patchOne)
router.delete('/photos/:id', photos.deleteOne)

export {
  router,
}
