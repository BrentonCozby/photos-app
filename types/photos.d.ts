export interface I_Photo {
  createdAt: Date | string
  description: string
  id: string
  name: string
  updatedAt: Date | string
  url: string
}

export interface I_PhotoNew {
  description: string
  name: string
  url: string
}
