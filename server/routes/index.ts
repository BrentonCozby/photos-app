import express from 'express'
import { toExpressHandler } from '@/utils'
import * as photosControllers from '@/controllers/photos'

const router = express.Router()

router.get(
  '/photos',
  toExpressHandler(photosControllers.getManyPhotos),
)
router.get(
  '/photos/:id',
  toExpressHandler(photosControllers.getOnePhoto),
)
router.post(
  '/photos',
  toExpressHandler(photosControllers.postOnePhoto),
)
router.patch(
  '/photos/:id',
  toExpressHandler(photosControllers.editOnePhoto),
)
router.delete(
  '/photos/:id',
  toExpressHandler(photosControllers.deleteOnePhoto),
)

export {
  router,
}
