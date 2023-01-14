import * as add from './add'
import * as edit from './edit'
import * as get from './get'
import * as remove from './remove'
import * as utils from './utils'

export default {
  ...get,
  ...add,
  ...edit,
  ...remove,
  ...utils,
}
