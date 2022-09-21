export * from './photos'

export const IS_PROD = process.env.NODE_ENV === 'production'

// AWS
export const MAIN_BUCKET = 'll-photos-app'
export const CLOUDFRONT_BASE = 'https://d26n381xceuozh.cloudfront.net'
export const PHOTOS_FILEPATH_BASE = 'photos'
