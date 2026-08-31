import { I_Photo, I_PhotoRepository } from '@/models'
import s3Service from '@/services/s3Service'

import { makeRemoveOne } from './remove'

jest.mock('@/services/s3Service', () => ({
  __esModule: true,
  default: {
    deleteObjects: jest.fn(),
    getClient: jest.fn(),
    getObject: jest.fn(),
    upload: jest.fn(),
  },
}))

const mockS3Service = jest.mocked(s3Service)

const CONTENT_HASH = '8lkeAK5d1x2'

const photo: I_Photo = {
  contentHash: CONTENT_HASH,
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  description: 'A test photo',
  id: 'ctest0000000000000000001',
  isArchived: false,
  largestSizeAvailable: 'sm',
  name: 'Test photo',
  updatedAt: new Date('2023-01-02T00:00:00.000Z'),
}

// largestSizeAvailable 'sm' covers the xs and sm variants.
const sharedS3Keys = [
  `photos/${CONTENT_HASH}-xs.webp`,
  `photos/${CONTENT_HASH}-sm.webp`,
]

function makeFakeRepository(photoCounts: number[]) {
  const counts = [...photoCounts]

  const photoRepository: I_PhotoRepository = {
    createHash: jest.fn(),
    createPhoto: jest.fn(),
    deleteHash: jest.fn(),
    deletePhoto: jest.fn(),
    findHash: jest.fn(),
    findHashWithPhotoCount: jest.fn(async () => ({ hash: CONTENT_HASH, photoCount: counts.shift() ?? 0 })),
    findPhotoById: jest.fn(async () => photo),
    findPhotos: jest.fn(),
    findPhotosByContentHash: jest.fn(),
    updatePhoto: jest.fn(),
  }

  return photoRepository
}

describe('removeOne', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('deletes the hash record and the S3 objects when the last photo using the hash goes', async () => {
    const photoRepository = makeFakeRepository([1, 0])
    const removeOne = makeRemoveOne({ photoRepository })

    await removeOne({ id: photo.id })

    expect(photoRepository.deletePhoto).toHaveBeenCalledWith({ id: photo.id })
    expect(photoRepository.deleteHash).toHaveBeenCalledWith({ contentHash: CONTENT_HASH })
    expect(mockS3Service.deleteObjects).toHaveBeenCalledWith({ keys: sharedS3Keys })
  })

  it('leaves the S3 objects alone when a duplicate photo still shares the content hash', async () => {
    const photoRepository = makeFakeRepository([2, 1])
    const removeOne = makeRemoveOne({ photoRepository })

    await removeOne({ id: photo.id })

    expect(photoRepository.deletePhoto).toHaveBeenCalledWith({ id: photo.id })
    expect(photoRepository.deleteHash).not.toHaveBeenCalled()
    expect(mockS3Service.deleteObjects).not.toHaveBeenCalled()
  })
})
