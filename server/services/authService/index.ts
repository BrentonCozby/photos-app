import { auth } from 'express-oauth2-jwt-bearer'

import { AUTH0_DOMAIN, AUTH0_PHOTOS_API_AUD } from '@/constants'
import { T_ExpressHandler } from '@/models'

/**
 * Attempts to verify an access token in the request.
 */
const verifyAccessToken: T_ExpressHandler = (...args) => {
  return auth({
    issuerBaseURL: AUTH0_DOMAIN,
    audience: AUTH0_PHOTOS_API_AUD,
  })(...args)
}

const authService = {
  verifyAccessToken,
}

export default authService
