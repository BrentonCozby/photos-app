export * from '@/../types'


export interface IHttpHeaders {
  [key: string]: string | undefined
}

export interface IHttpRequest<B = any> {
  method: string
  ip: string
  path: string
  headers: IHttpHeaders
  query: Record<string, any>
  pathParams: Record<string, string>
  body?: B
}

export interface IHttpResponse<B = any> {
  headers: IHttpHeaders
  status: string | number
  body?: B
}

export type Controller<Q = any, P = any> = (request: IHttpRequest<Q>) => Promise<IHttpResponse<P>>
