import { makeAddOne } from './add'
import { makeEditOne } from './edit'
import { makeGetDuplicates, makeGetHash, makeGetMany, makeGetOne } from './get'
import { makeRemoveOne } from './remove'
import { I_PhotoServiceDeps } from './types'

export function makePhotoService(deps: I_PhotoServiceDeps) {
  return {
    addOne: makeAddOne(deps),
    editOne: makeEditOne(deps),
    getDuplicates: makeGetDuplicates(deps),
    getHash: makeGetHash(deps),
    getMany: makeGetMany(deps),
    getOne: makeGetOne(deps),
    removeOne: makeRemoveOne(deps),
  }
}

export type T_PhotoService = ReturnType<typeof makePhotoService>
