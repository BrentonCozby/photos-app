import { I_ErrorOptions } from '@/types'

export class AuthError extends Error {
  name: string

  constructor({
    message,
    options,
  }: {
    message: string
    options?: I_ErrorOptions
  }) {
    super(message, options)

    this.name = 'AuthError'
  }
}
