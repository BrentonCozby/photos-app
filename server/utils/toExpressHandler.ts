import { T_Controller, T_ErrorController, I_HttpRequest } from '@/types'
import express, { ErrorRequestHandler } from 'express'

type toExpressHandlerType = (controller: T_Controller) => express.Handler

export const toExpressHandler: toExpressHandlerType = (controller) => {
  return async (req, res, next) => {
    const httpRequest: I_HttpRequest = {
      body: req.body,
      query: req.query,
      pathParams: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: req.headers,
    }

    let httpResponse

    try {
      httpResponse = await controller(httpRequest)
    } catch (error) {
      return next(error)
    }

    if (httpResponse.headers) {
      res.set(httpResponse.headers)
    }

    res
      .status(Number(httpResponse.status))
      .type(httpResponse.headers['Content-Type']?.toString() || 'json')
      .send(httpResponse.body)
  }
}

type toExpressErrorHandlerType = (controller: T_ErrorController) => ErrorRequestHandler

export const toExpressErrorHandler: toExpressErrorHandlerType = (controller) => {
  return async (err, req, res, next) => {
    const httpRequest: I_HttpRequest = {
      body: req.body,
      query: req.query,
      pathParams: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: req.headers,
    }

    let httpResponse

    try {
      httpResponse = await controller(err, httpRequest)
    } catch (error) {
      console.error(error)

      return next(error)
    }

    if (httpResponse.headers) {
      res.set(httpResponse.headers)
    }

    res
      .status(Number(httpResponse.status))
      .type(httpResponse.headers['Content-Type']?.toString() || 'json')
      .send(httpResponse.body)

    next(err)
  }
}
