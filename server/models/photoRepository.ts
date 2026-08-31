import { I_Photo } from '@/../models'

export interface I_PhotoHash {
  hash: I_Photo['contentHash']
}

export interface I_PhotoHashWithPhotoCount extends I_PhotoHash {
  photoCount: number
}

/** Storage port for photos. Only server/db may implement it. */
export interface I_PhotoRepository {
  createHash(args: { contentHash: I_Photo['contentHash'] }): Promise<void>
  createPhoto(args: { photo: I_Photo }): Promise<I_Photo>
  /**
   * Deletes the photo and, when it was the last one on its content hash, the hash
   * record too, in one transaction. Throws NotFoundError when no photo has that id.
   */
  deletePhotoAndUnusedHash(args: {
    id: I_Photo['id']
    contentHash: I_Photo['contentHash']
  }): Promise<{ isHashRemoved: boolean }>
  findHash(args: { contentHash: I_Photo['contentHash'] }): Promise<I_PhotoHash | null>
  findHashWithPhotoCount(args: { contentHash: I_Photo['contentHash'] }): Promise<I_PhotoHashWithPhotoCount | null>
  findPhotoById(args: { id: I_Photo['id'] }): Promise<I_Photo | null>
  findPhotos(args: { limit: number }): Promise<I_Photo[]>
  findPhotosByContentHash(args: { contentHash: I_Photo['contentHash'] }): Promise<I_Photo[]>
  updatePhoto(args: { id: I_Photo['id'], values: Partial<I_Photo> }): Promise<I_Photo>
}
