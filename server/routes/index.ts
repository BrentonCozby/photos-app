import express from 'express'

import { I_PhotoControllerDeps, makePhotoControllers } from '@/controllers'

export function makeMainRouter(deps: I_PhotoControllerDeps) {
  const photos = makePhotoControllers(deps)

  const mainRouter = express.Router()

  mainRouter.get('/photos', photos.getMany)
  mainRouter.get('/photos/:id', photos.getOne)
  mainRouter.post('/photos', photos.postOne)
  mainRouter.patch('/photos/:id', photos.patchOne)
  mainRouter.delete('/photos/:id', photos.deleteOne)

  return mainRouter
}
