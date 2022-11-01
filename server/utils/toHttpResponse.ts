import { I_HttpHeaders, I_HttpResponse } from '@/models'

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
    status = 200,
    body,
  } = args || {}

  const response: I_HttpResponse = {
    headers,
    status,
    statusCode: status,
  }

  if (body) {
    response.body = body
  }

  return response
}
