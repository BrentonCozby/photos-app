import { UnauthorizedError } from 'express-oauth2-jwt-bearer'
import JSONAPISerializer from 'json-api-serializer'

import { T_ErrorController } from '@/models'
import { toHttpResponse } from '@/utils'

import { DuplicationError, NotFoundError, RequiredError, StaleDataError, ValidationError } from './validation'

const ErrorSerializer = new JSONAPISerializer()
ErrorSerializer.register('error')

interface I_ErrorWithStatus extends Error {
  status: string
}

interface I_ErrorDocument {
  errors?: Array<{ meta?: Record<string, unknown> }>
}

// serializeError is typed as returning one error object, but it returns a
// document with an errors array.
function isErrorDocument(value: unknown): value is I_ErrorDocument {
  return typeof value === 'object' && value !== null && 'errors' in value
}

export const errorHandlers: T_ErrorController = async (error) => {
  let errorResponse = toHttpResponse({
    status: (error as I_ErrorWithStatus).status || 500,
    body: ErrorSerializer.serializeError(error as Error),
  })

  if (error instanceof UnauthorizedError) {
    const body = ErrorSerializer.serializeError(error)

    if (isErrorDocument(body)) {
      body.errors?.forEach((entry) => {
        entry.meta = { ...entry.meta, source: 'auth0' }
      })
    }

    errorResponse = toHttpResponse({
      status: error.status,
      headers: error.headers,
      body,
    })
  }

  if (error instanceof NotFoundError) {
    errorResponse = toHttpResponse({
      status: 404,
      body: ErrorSerializer.serializeError(error),
    })
  }

  if (
    error instanceof ValidationError ||
    error instanceof RequiredError ||
    error instanceof DuplicationError
  ) {
    errorResponse = toHttpResponse({
      status: 400,
      body: ErrorSerializer.serializeError(error),
    })
  }

  if (error instanceof StaleDataError) {
    errorResponse = toHttpResponse({
      status: 409,
      body: ErrorSerializer.serializeError(error),
    })
  }

  return errorResponse
}
