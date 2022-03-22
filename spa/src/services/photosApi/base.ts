import { createHttpInstance } from '@/services/http'

const {
  VITE_PHOTOS_SERVICE_HOST: HOST,
  VITE_PHOTOS_SERVICE_PORT: PORT,
} = import.meta.env

/**
 * An http instance for making requests to the Photos Service
 */
export const photosHttp = createHttpInstance({
  baseURL: `http://${HOST}:${PORT}/photos`,
})

photosHttp.interceptors.request.use(async (config) => {
  if (config.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${config.accessToken}`,
    }
  }

  return config
})
