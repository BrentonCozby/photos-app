import { T_Controller, T_ErrorController, I_HttpRequest, T_ExpressHandler, T_ExpressErrorHandler } from '@/types'

type toExpressHandlerType = (controller: T_Controller) => T_ExpressHandler

export const toExpressHandler: toExpressHandlerType = (controller) => {
  return async (req, res, next) => {
    const httpRequest: I_HttpRequest = {
      body: req.body,
      file: req.file,
      files: req.files,
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

type toExpressErrorHandlerType = (controller: T_ErrorController) => T_ExpressErrorHandler

export const toExpressErrorHandler: toExpressErrorHandlerType = (controller) => {
  return async (err, req, res, next) => {
    const httpRequest: I_HttpRequest = {
      body: req.body,
      file: req.file,
      files: req.files,
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
