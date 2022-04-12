import axios from 'axios'
import authService from '../auth'


export const createHttpInstance = ({
  baseURL,
  headers,
}: {
  baseURL?: string
  headers?: Record<string, string>
} = {}) => {
  const httpInstance = axios.create({
    baseURL: baseURL,
  })

  if (headers) {
    httpInstance.defaults.headers.common = headers
  }

  httpInstance.interceptors.request.use(async (config) => {
    if (config.headers && !headers?.Authorization) {
      const accessToken = await authService.getAccessToken()

      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  return httpInstance
}


export const http = createHttpInstance()
