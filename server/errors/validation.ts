import { I_JsonError } from '@/types'
import { I_ErrorOptions } from './types'
import { BasicError } from './base'

export class ValidationError extends BasicError {
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
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
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

export class RequiredError extends BasicError {
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
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
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

export class NotFoundError extends BasicError {
  name: string

  constructor({
    message = 'Resource not found',
    options,
    meta,
    source,
  }: {
    message?: string
    options?: I_ErrorOptions
    meta?: Record<string, string>
    source?: I_JsonError['source']
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

export class StaleDataError extends BasicError {
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
    options?: I_ErrorOptions
    meta?: Record<string, string>
    source?: I_JsonError['source']
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
