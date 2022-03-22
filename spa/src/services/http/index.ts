import axios from 'axios'


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

  return httpInstance
}


export const http = createHttpInstance()
