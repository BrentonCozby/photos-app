export interface I_Photo {
  createdAt: Date | string
  contentHash: string
  description: string
  fileBuffer?: Buffer
  id: string
  isArchived: boolean
  name: string
  updatedAt: Date | string
  url: string
}

export interface I_PhotoNew {
  description: string
  name: string
}

export interface I_PhotoUpdate extends Partial<I_Photo> {
  id: I_Photo['id']
}
