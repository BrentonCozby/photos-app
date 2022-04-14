import { UnauthorizedError } from 'express-oauth2-jwt-bearer'
import { toHttpResponse } from '@/utils'
import JSONAPISerializer from 'json-api-serializer'
import { T_ErrorController } from '@/types'

const ErrorSerializer = new JSONAPISerializer()
ErrorSerializer.register('error')

interface I_ErrorWithStatus extends Error {
  status: string
}

export const errorHandlers: T_ErrorController = async (error) => {
  let errorResponse = toHttpResponse({
    status: (error as I_ErrorWithStatus).status || 500,
    body: ErrorSerializer.serializeError(error as Error),
  })

  if (error instanceof UnauthorizedError) {
    const body = ErrorSerializer.serializeError(error) as JSONAPISerializer.JSONAPIDocument

    body.errors?.forEach((error) => {
      error.meta = { ...error.meta, source: 'auth0' }
    })

    errorResponse = toHttpResponse({
      status: error.status,
      headers: error.headers,
      body,
    })
  }

  return errorResponse
}
