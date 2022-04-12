import { I_ErrorOptions } from '@/types'

export class AuthError extends Error {
  name: string

  constructor(args: {
    message: string
    options?: I_ErrorOptions
  }) {
    const {
      message,
      options,
    } = args

    super(message, options)

    this.name = 'AuthError'
  }
}
