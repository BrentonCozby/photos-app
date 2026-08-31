import { I_HttpRequest, T_Controller, T_ErrorController, T_ExpressErrorHandler, T_ExpressHandler } from '@/models'

type T_ExpressRequest = Parameters<T_ExpressHandler>[0]

function toHttpRequest(req: T_ExpressRequest): I_HttpRequest {
  const pathParams: I_HttpRequest['pathParams'] = {}

  for (const [name, value] of Object.entries(req.params)) {
    // A wildcard route matches several segments, so rejoin them into one path.
    pathParams[name] = Array.isArray(value) ? value.join('/') : value
  }

  return {
    body: req.body,
    file: req.file,
    files: req.files,
    query: req.query,
    pathParams,
    ip: req.ip,
    method: req.method,
    path: req.path,
    headers: req.headers,
  }
}

type toExpressHandlerType = (controller: T_Controller) => T_ExpressHandler

export const toExpressHandler: toExpressHandlerType = (controller) => {
  return async (req, res, next) => {
    const httpRequest = toHttpRequest(req)

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
    const httpRequest = toHttpRequest(req)

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
