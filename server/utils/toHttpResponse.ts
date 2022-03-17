import { IHttpHeaders, IHttpResponse } from '@/types'

const defaultHeaders: IHttpHeaders = {
  'Content-Type': 'application/json',
}

export const toHttpResponse = <B = any>({
  headers = defaultHeaders,
  status = 200, // OK
  body,
}: {
  headers?: IHttpHeaders
  status?: string | number
  body?: B | IHttpResponse['body']
}) => {
  const response: IHttpResponse = {
    headers,
    status,
  }

  if (body) {
    response.body = body
  }

  return response
}
