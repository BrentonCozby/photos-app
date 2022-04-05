import express from 'express'

export * from '@/../types'

export type T_ExpressHandler = express.Handler

export interface I_HttpHeaders {
  [key: string]: string | string[] | undefined
}

export interface I_HttpRequest<B = any> {
  method: string
  ip: string
  path: string
  headers: I_HttpHeaders
  query: Record<string, any>
  pathParams: Record<string, string>
  body?: B
}

export interface I_HttpResponse<B = any> {
  headers: I_HttpHeaders
  status: string | number
  body?: B
}

export type T_Controller<Q = any, P = any> = (request: I_HttpRequest<Q>) => Promise<I_HttpResponse<P>>

export type T_ErrorController<E = unknown, Q = any, P = any> = (error: E, request: I_HttpRequest<Q>) => Promise<I_HttpResponse<P>>
