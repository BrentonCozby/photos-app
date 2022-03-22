import { IErrorOptions } from '@/errors/types'
import { I_JsonError } from '@/types'

export class BasicError extends Error {
  name: string
  code: string
  source?: I_JsonError['source']
  meta?: I_JsonError['meta']

  constructor({
    code,
    message,
    options,
    source,
    meta,
  }: {
    code: string
    message: string
    options?: IErrorOptions
    source?: I_JsonError['source']
    meta?: I_JsonError['meta']
  }) {
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
