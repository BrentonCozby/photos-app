export * from '@/../constants'

// Every environment variable the server reads is named here, so no other layer
// has to reach for process.env.
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN || ''
export const AUTH0_PHOTOS_API_AUD = process.env.AUTH0_PHOTOS_API_AUD || ''
export const AWS_S3_ACCESS_KEY_ID = process.env.AWS_S3_ACCESS_KEY_ID || ''
export const AWS_S3_REGION = process.env.AWS_S3_REGION || ''
export const AWS_S3_SECRET_ACCESS_KEY = process.env.AWS_S3_SECRET_ACCESS_KEY || ''
