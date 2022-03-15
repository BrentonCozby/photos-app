import { getOne, getMany } from './get'
import { addOne } from './add'
import { removeOne } from './remove'
import photosRouter from './router'

export default {
  photosRouter,
  getOne,
  getMany,
  addOne,
  removeOne,
}