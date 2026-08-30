import authService from './authService'
import { makePhotoService } from './photoService'
import s3Service from './s3Service'

export type { T_PhotoService } from './photoService'

export {
  authService,
  makePhotoService,
  s3Service,
}
