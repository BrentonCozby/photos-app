import { T_PhotoSizesConfig } from '../types'

export const SIZES_CONFIG: T_PhotoSizesConfig = Object.freeze({
  xs: {
    width: 140,
    height: 220,
  },
  sm: {
    width: 360,
    height: 600,
  },
  md: {
    width: 820,
    height: 1180,
  },
  lg: {
    width: 1600,
    height: 2200,
  },
  xl: {
    width: 2000,
    height: 3200,
  },
})

export const IMAGE_MIME_TYPES = Object.freeze([
  'image/avif',
  'image/bmp',
  'image/gif',
  'image/jpeg',
  'image/png',
  'image/apng',
  'image/svg+xml',
  'image/tiff',
  'image/webp',
])
