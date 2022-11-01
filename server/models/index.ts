import express, { Express } from 'express'

export * from '@/../models'

export type T_ExpressHandler = express.Handler
export type T_ExpressErrorHandler = express.ErrorRequestHandler

export type T_File = Express.Multer.File

export interface I_HttpHeaders {
  [key: string]: string | string[] | undefined
}

export interface I_HttpRequest<B = any> {
  body?: B
  file?: T_File
  files?: T_File[] | { [fieldname: string]: T_File[] }
  headers: I_HttpHeaders
  ip: string
  method: string
  path: string
  pathParams: Record<string, string>
  query: Record<string, any>
}

export interface I_HttpResponse<B = any> {
  headers: I_HttpHeaders
  status: string | number
  statusCode: string | number
  body?: B
}

export type T_Controller<Q = any, P = any> = (request: I_HttpRequest<Q>) => Promise<I_HttpResponse<P>>

export type T_ErrorController<E = unknown, Q = any, P = any> = (error: E, request: I_HttpRequest<Q>) => Promise<I_HttpResponse<P>>
