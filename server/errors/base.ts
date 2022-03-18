import { IErrorOptions } from '@/errors/types'
import { IJsonError } from '@/types'

export class BasicError extends Error {
  name: string
  code: string
  source?: IJsonError['source']
  meta?: IJsonError['meta']

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
    source?: IJsonError['source']
    meta?: IJsonError['meta']
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
