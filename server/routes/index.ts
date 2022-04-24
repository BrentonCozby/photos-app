import express from 'express'
import * as photos from '@/controllers/photos'

const mainRouter = express.Router()

mainRouter.get('/photos', photos.getMany)
mainRouter.get('/photos/:id', photos.getOne)
mainRouter.post('/photos', photos.post)
mainRouter.patch('/photos/:id', photos.patchOne)
mainRouter.delete('/photos/:id', photos.deleteOne)

export {
  mainRouter,
}
