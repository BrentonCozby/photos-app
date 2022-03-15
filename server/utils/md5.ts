import crypto from 'crypto'

export type md5Type = (text: string) => string

export const md5: md5Type = (text: string) => {
  return crypto
    .createHash('md5')
    .update(text, 'utf-8')
    .digest('hex')
}

export default md5