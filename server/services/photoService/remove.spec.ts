import { photoRepository } from '@/db'
import { I_Photo } from '@/models'
import s3Service from '@/services/s3Service'

import { removeOne } from './remove'

jest.mock('@/db', () => ({
  photoRepository: {
    deletePhotoAndUnusedHash: jest.fn(),
    findHashWithPhotoCount: jest.fn(),
    findPhotoById: jest.fn(),
  },
}))

jest.mock('@/services/s3Service', () => ({
  __esModule: true,
  default: {
    deleteObjects: jest.fn(),
    getClient: jest.fn(),
    getObject: jest.fn(),
    upload: jest.fn(),
  },
}))

const mockPhotoRepository = jest.mocked(photoRepository)
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

describe('removeOne', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockPhotoRepository.findPhotoById.mockResolvedValue(photo)
    mockPhotoRepository.findHashWithPhotoCount.mockResolvedValue({ hash: CONTENT_HASH, photoCount: 1 })
  })

  it('deletes the S3 objects when the last photo using the hash goes', async () => {
    mockPhotoRepository.deletePhotoAndUnusedHash.mockResolvedValue({ isHashRemoved: true })

    await removeOne({ id: photo.id })

    expect(mockPhotoRepository.deletePhotoAndUnusedHash).toHaveBeenCalledWith({
      id: photo.id,
      contentHash: CONTENT_HASH,
    })
    expect(mockS3Service.deleteObjects).toHaveBeenCalledWith({ keys: sharedS3Keys })
  })

  it('leaves the S3 objects alone when a duplicate photo still shares the content hash', async () => {
    mockPhotoRepository.deletePhotoAndUnusedHash.mockResolvedValue({ isHashRemoved: false })

    await removeOne({ id: photo.id })

    expect(mockPhotoRepository.deletePhotoAndUnusedHash).toHaveBeenCalled()
    expect(mockS3Service.deleteObjects).not.toHaveBeenCalled()
  })
})
