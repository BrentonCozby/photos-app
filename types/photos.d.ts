export interface I_Photo {
  createdAt: Date | string
  contentHash: string
  description: string
  id: string
  isArchived: boolean
  largestSizeAvailable: T_PhotoSizes
  name: string
  updatedAt: Date | string
}

export interface I_PhotoNew {
  description: string
  file: File
  name: string
}

export interface I_PhotoUpdate extends Partial<I_Photo> {
  id: I_Photo['id']
}

export type T_PhotoSizes = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type T_PhotoSizesConfig = {
  [key in T_PhotoSizes]: {
    width: number
    height: number
  }
}
