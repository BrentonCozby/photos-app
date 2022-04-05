import { IErrorOptions } from '@/types'

export class AuthError extends Error {
  name: string

  constructor({
    message,
    options,
  }: {
    message: string
    options?: IErrorOptions
  }) {
    super(message, options)

    this.name = 'AuthError'
  }
}
