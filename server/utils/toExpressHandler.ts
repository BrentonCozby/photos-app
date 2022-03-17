import { Controller, IHttpRequest } from '@/types'
import express from 'express'
import statuses from 'statuses'

type toExpressHandlerType = (controller: Controller) => express.Handler

export const toExpressHandler: toExpressHandlerType = (controller) => {
  return async (req, res) => {
    const httpRequest: IHttpRequest = {
      body: req.body,
      query: req.query,
      pathParams: req.params,
      ip: req.ip,
      method: req.method,
      path: req.path,
      headers: {
        'Content-Type': req.get('Content-Type'),
        Referer: req.get('referer'),
        'User-Agent': req.get('User-Agent'),
      },
    }

    let httpResponse

    try {
      httpResponse = await controller(httpRequest)
    } catch (error) {
      console.error(error)

      return res
        .status(Number(statuses('Internal Server Error')))
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
