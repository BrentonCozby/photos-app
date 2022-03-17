import { IJsonError } from '@/types'
import { IErrorOptions } from './types'
import { JsonApiError } from './base'

export class ValidationError extends JsonApiError {
  name: string

  constructor({
    fieldName,
    value,
    message,
    options,
    meta,
    source,
  }: {
    fieldName: string
    value: unknown
    message: string
    options?: IErrorOptions
    meta?: IJsonError['meta']
    source?: IJsonError['source']
  }) {
    super({
      code: 'PAE-1',
      message: `Field: ${fieldName}. Value: ${JSON.stringify(value)}. Message: ${message}`,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-1',
        ...meta,
      },
      source,
    })

    this.name = 'ValidationError'
  }
}

export class RequiredError extends JsonApiError {
  name: string

  constructor({
    fieldName,
    value,
    options,
    meta,
    source,
  }: {
    fieldName: string
    value: unknown
    options?: IErrorOptions
    meta?: IJsonError['meta']
    source?: IJsonError['source']
  }) {
    super({
      code: 'PAE-2',
      message: `Missing field: ${fieldName}. Received value: ${JSON.stringify(value)}`,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-2',
        ...meta,
      },
      source,
    })

    this.name = 'RequiredError'
  }
}

export class NotFoundError extends JsonApiError {
  name: string

  constructor({
    message = 'Resource not found',
    options,
    meta,
    source,
  }: {
    message?: string
    options?: IErrorOptions
    meta?: Record<string, string>
    source?: IJsonError['source']
  } = {}) {
    super({
      code: 'PAE-3',
      message,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-3',
        ...meta,
      },
      source,
    })

    this.name = 'NotFoundError'
  }
}

export class StaleDataError extends JsonApiError {
  name: string

  constructor({
    resourceName = 'record',
    staleField,
    options,
    meta,
    source,
  }: {
    resourceName?: string
    staleField?: string
    options?: IErrorOptions
    meta?: Record<string, string>
    source?: IJsonError['source']
  } = {}) {
    super({
      code: 'PAE-4',
      message: `This ${resourceName} has already been modified. Try again with new data${staleField ? ' for ' + staleField : ''}.`,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-4',
        ...meta,
      },
      source,
    })

    this.name = 'StaleDataError'
  }
}
