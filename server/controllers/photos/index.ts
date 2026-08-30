import makeDeleteOne from './deleteOne'
import makeGetMany from './getMany'
import makeGetOne from './getOne'
import makePatchOne from './patchOne'
import makePostOne from './postOne'
import { I_PhotoControllerDeps } from './types'

export type { I_PhotoControllerDeps } from './types'

export function makePhotoControllers(deps: I_PhotoControllerDeps) {
  return {
    deleteOne: makeDeleteOne(deps),
    getMany: makeGetMany(deps),
    getOne: makeGetOne(deps),
    patchOne: makePatchOne(deps),
    postOne: makePostOne(deps),
  }
}
