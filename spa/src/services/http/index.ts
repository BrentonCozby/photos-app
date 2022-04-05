import axios from 'axios'
import AuthService from '../auth'


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
      const accessToken = await AuthService.getAccessToken()

      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  return httpInstance
}


export const http = createHttpInstance()
