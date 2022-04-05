import { BasicError } from './base'
import { I_ErrorOptions, I_JsonError } from '@/types'

export class AuthError extends BasicError {
  name: string

  constructor({
    message,
    options,
    meta,
    source,
  }: {
    message: string
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
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
