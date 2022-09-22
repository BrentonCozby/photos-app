import { I_JsonError } from '@/types'
import { I_ErrorOptions } from './types'
import { BasicError } from './base'

export class ValidationError extends BasicError {
  name: string

  constructor(args: {
    fieldName: string
    value: unknown
    message: string
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
    const {
      fieldName,
      value,
      message,
      options,
      meta,
      source,
    } = args

    super({
      code: 'PAE-1',
      message: `Field: ${fieldName}. Value: ${JSON.stringify(value)}. Message: ${message}`,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-1',
        fieldName,
        value,
        message,
        ...meta,
      },
      source,
    })

    this.name = 'ValidationError'
  }
}

export class RequiredError extends BasicError {
  name: string

  constructor(args: {
    fieldName: string
    value: unknown
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
    const {
      fieldName,
      value,
      options,
      meta,
      source,
    } = args

    super({
      code: 'PAE-2',
      message: `Missing field: ${fieldName}. Received value: ${JSON.stringify(value)}`,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-2',
        fieldName,
        value,
        ...meta,
      },
      source,
    })

    this.name = 'RequiredError'
  }
}

export class NotFoundError extends BasicError {
  name: string

  constructor(args?: {
    message?: string
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
    const {
      message = 'Resource not found',
      options,
      meta,
      source,
    } = args || {}

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

/**
 * For when attempting to add/create a resource that already exists
 */
export class DuplicationError extends BasicError {
  name: string

  constructor(args?: {
    message?: string
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
    const {
      message = 'Resource already exists',
      options,
      meta,
      source,
    } = args || {}

    super({
      code: 'PAE-4',
      message,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-4',
        ...meta,
      },
      source,
    })

    this.name = 'DuplicationError'
  }
}

export class StaleDataError extends BasicError {
  name: string

  constructor(args?: {
    resourceName?: string
    staleField?: string
    options?: I_ErrorOptions
    meta?: I_JsonError['meta']
    source?: I_JsonError['source']
  }) {
    const {
      resourceName = 'record',
      staleField,
      options,
      meta,
      source,
    } = args || {}

    super({
      code: 'PAE-5',
      message: `This ${resourceName} has already been modified. Try again with new data${staleField ? ' for ' + staleField : ''}.`,
      options,
      meta: {
        about: 'photosapp.com/errors/PAE-5',
        resourceName,
        staleField,
        ...meta,
      },
      source,
    })

    this.name = 'StaleDataError'
  }
}
