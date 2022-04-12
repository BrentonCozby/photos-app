import { I_HttpHeaders, I_HttpResponse } from '@/types'

const defaultHeaders: I_HttpHeaders = {
  'Content-Type': 'application/json',
}

export const toHttpResponse = <B = any>(args?: {
  headers?: I_HttpHeaders
  status?: string | number
  body?: B | I_HttpResponse['body']
}) => {
  const {
    headers = defaultHeaders,
    status = 200, // OK
    body,
  } = args || {}

  const response: I_HttpResponse = {
    headers,
    status,
  }

  if (body) {
    response.body = body
  }

  return response
}
