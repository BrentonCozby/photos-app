import { IErrorOptions } from './types'

export class ValidationError extends Error {
  constructor({
    fieldName,
    value,
    message,
    options,
  }: {
    fieldName: string
    value: unknown
    message: string
    options?: IErrorOptions
  }) {
    super(`\nField: ${fieldName}\nValue: ${JSON.stringify(value)}\n\n${message}`, options)
    this.name = 'ValidationError'
  }
}

export class RequiredError extends Error {
  constructor({
    fieldName,
    value,
    options,
  }: {
    fieldName: string
    value: unknown
    options?: IErrorOptions
  }) {
    super(`\nField: ${fieldName}\nValue: ${JSON.stringify(value)}\n`, options)
    this.name = 'RequiredError'
  }
}
