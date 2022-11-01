import { I_ErrorOptions } from '@/errors/types'
import { I_JsonError } from '@/models'

export class BasicError extends Error {
  name: string
  code: string
  source?: I_JsonError['source']
  meta?: I_JsonError['meta']

  constructor(args: {
    code: string
    message: string
    options?: I_ErrorOptions
    source?: I_JsonError['source']
    meta?: I_JsonError['meta']
  }) {
    const {
      code,
      message,
      options,
      source,
      meta,
    } = args

    super(message, options)

    this.name = 'Error'
    this.code = code

    if (source) {
      this.source = source
    }

    if (meta) {
      this.meta = meta
    }
  }
}
