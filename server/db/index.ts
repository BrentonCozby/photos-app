import { makePhotoRepository } from './photoRepository'

/** The one implementation of I_PhotoRepository. Swapping storage means swapping this. */
export const photoRepository = makePhotoRepository()
