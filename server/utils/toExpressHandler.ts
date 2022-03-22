import { T_Controller, I_HttpRequest } from '@/types'
import express from 'express'

type toExpressHandlerType = (controller: T_Controller) => express.Handler

export const toExpressHandler: toExpressHandlerType = (controller) => {
  return async (req, res) => {
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
      console.error(error)

      return res
        .status(500)
        .send({ error: 'An unkown error occurred.' })
    }

    if (httpResponse.headers) {
      res.set(httpResponse.headers)
    }

    res
      .status(Number(httpResponse.status))
      .type(httpResponse.headers['Content-Type'] || 'json')
      .send(httpResponse.body)
  }
}
