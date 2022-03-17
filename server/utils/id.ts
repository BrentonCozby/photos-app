import cuid from 'cuid'

export type ICreateId = () => string

export const createId: ICreateId = () => {
  return cuid()
}

export type IIsValidId = (id: string) => boolean

export const isValidId: IIsValidId = (id) => {
  return cuid.isCuid(id)
}