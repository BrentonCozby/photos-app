import { BasicError } from './base'
import { I_ErrorOptions, I_JsonError } from '@/types'

export class AuthError extends BasicError {
  name: string

  constructor(args: {
    message: string
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
    const {
      message,
      options,
      meta,
      source,
    } = args

    super({
      code: 'PAE-100',
      message,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-100',
        ...meta,
      },
      source,
    })

    this.name = 'AuthError'
  }
}
