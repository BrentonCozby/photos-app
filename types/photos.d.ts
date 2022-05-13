export interface I_Photo {
  createdAt: Date | string
  description: string
  id: string
  isArchived: boolean
  name: string
  updatedAt: Date | string
  url: string
}

export interface I_PhotoNew {
  description: string
  name: string
  url: string
}

export interface I_PhotoUpdate extends Partial<I_Photo> {
  id: I_Photo['id']
}
