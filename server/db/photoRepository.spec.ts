import { Prisma } from '@prisma/client'

import { NotFoundError } from '@/errors'

import { makePhotoRepository } from './photoRepository'

jest.mock('./prisma')

// jest.mock swaps in db/__mocks__/prisma.ts; requireMock returns that same instance.
const { prisma: mockPrisma } = jest.requireMock<typeof import('./__mocks__/prisma')>('./prisma')

type T_TransactionCallback = import('./__mocks__/prisma').T_TransactionCallback

const CONTENT_HASH = '8lkeAK5d1x2'
const PHOTO_ID = 'ctest0000000000000000001'

function recordNotFoundError() {
  return new Prisma.PrismaClientKnownRequestError('Record to delete does not exist.', 'P2025', '4.5.0')
}

const photoRepository = makePhotoRepository()

describe('deletePhotoAndUnusedHash', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    mockPrisma.$transaction.mockImplementation((run: T_TransactionCallback) => run(mockPrisma))
  })

  it('deletes the photo, the recount and the hash record in one transaction', async () => {
    mockPrisma.photo.count.mockResolvedValue(0)

    const result = await photoRepository.deletePhotoAndUnusedHash({ id: PHOTO_ID, contentHash: CONTENT_HASH })

    expect(result).toEqual({ isHashRemoved: true })
    expect(mockPrisma.$transaction).toHaveBeenCalledTimes(1)
    expect(mockPrisma.photo.delete).toHaveBeenCalledWith({ where: { id: PHOTO_ID } })
    expect(mockPrisma.photoHash.delete).toHaveBeenCalledWith({ where: { hash: CONTENT_HASH } })
  })

  it('keeps the hash record while another photo still uses it', async () => {
    mockPrisma.photo.count.mockResolvedValue(1)

    const result = await photoRepository.deletePhotoAndUnusedHash({ id: PHOTO_ID, contentHash: CONTENT_HASH })

    expect(result).toEqual({ isHashRemoved: false })
    expect(mockPrisma.photoHash.delete).not.toHaveBeenCalled()
  })

  it('carries on when a concurrent delete already removed the hash record', async () => {
    mockPrisma.photo.count.mockResolvedValue(0)
    mockPrisma.photoHash.delete.mockRejectedValue(recordNotFoundError())

    const result = await photoRepository.deletePhotoAndUnusedHash({ id: PHOTO_ID, contentHash: CONTENT_HASH })

    expect(result).toEqual({ isHashRemoved: false })
  })

  it('answers NotFoundError when the photo is gone by the time it is deleted', async () => {
    mockPrisma.photo.delete.mockRejectedValue(recordNotFoundError())

    await expect(photoRepository.deletePhotoAndUnusedHash({ id: PHOTO_ID, contentHash: CONTENT_HASH }))
      .rejects.toThrow(new NotFoundError({ message: 'Photo does not exist.' }))

    expect(mockPrisma.photoHash.delete).not.toHaveBeenCalled()
  })
})
