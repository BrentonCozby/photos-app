import * as add from './add'
import * as edit from './edit'
import * as get from './get'
import * as remove from './remove'

export default {
  ...get,
  ...add,
  ...edit,
  ...remove,
}
