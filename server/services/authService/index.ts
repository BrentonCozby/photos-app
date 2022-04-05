import { auth } from 'express-oauth2-jwt-bearer'
import { T_ExpressHandler } from '@/types'

/**
 * Attempts to verify an access token in the request.
 */
const verifyAccessToken: T_ExpressHandler = (...args) => {
  return auth({
    issuerBaseURL: String(process.env.AUTH0_DOMAIN),
    audience: String(process.env.AUTH0_PHOTOS_API_AUD),
  })(...args)
}

const authService = {
  verifyAccessToken,
}

export default authService
