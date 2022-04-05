import { UnauthorizedError } from 'express-oauth2-jwt-bearer'
import { AuthError } from '@/errors'
import { toHttpResponse } from '@/utils'
import JSONAPISerializer from 'json-api-serializer'
import { I_HttpResponse, T_ErrorController } from '@/types'

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
    errorResponse = handleAuth0Error(error)
  }

  return errorResponse
}

function handleAuth0Error(error: UnauthorizedError): I_HttpResponse {
  const newError = new AuthError({
    message: error.message,
    options: { cause: error },
  })

  return toHttpResponse({
    status: 401,
    body: ErrorSerializer.serializeError(newError),
  })
}
