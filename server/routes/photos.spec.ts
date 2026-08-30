import path from 'path'
import request from 'supertest'

import createApp from '@/app'
import s3Service from '@/services/s3Service'

jest.mock('@/db/prisma')

jest.mock('@/services/authService', () => ({
  __esModule: true,
  default: {
    verifyAccessToken: (req: unknown, res: unknown, next: () => void) => next(),
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

// jest.mock swaps in db/__mocks__/prisma.ts; requireMock hands back that same instance.
const { prisma: mockPrisma } = jest.requireMock<typeof import('@/db/__mocks__/prisma')>('@/db/prisma')
const mockS3Service = jest.mocked(s3Service)

const TEST_PHOTO_PATH = path.resolve(__dirname, '..', 'entities', 'test-photo.jpg')

/** Jimp's perceptual hash of entities/test-photo.jpg. */
const TEST_PHOTO_HASH = '8lkeAK5d1x2'

const photoRow = {
  contentHash: TEST_PHOTO_HASH,
  createdAt: new Date('2023-01-01T00:00:00.000Z'),
  description: 'A test photo',
  id: 'ctest0000000000000000001',
  isArchived: false,
  largestSizeAvailable: 'sm',
  name: 'Test photo',
  updatedAt: new Date('2023-01-02T00:00:00.000Z'),
}

const otherPhotoRow = {
  ...photoRow,
  description: 'Another test photo',
  id: 'ctest0000000000000000002',
  name: 'Another test photo',
}

describe('photos routes', () => {
  let app: Awaited<ReturnType<typeof createApp>>

  beforeAll(async () => {
    app = await createApp()
  })

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('GET /photos', () => {
    it('serializes every photo with a top level count', async () => {
      mockPrisma.photo.findMany.mockResolvedValue([photoRow, otherPhotoRow])

      const response = await request(app).get('/photos')

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.findMany).toHaveBeenCalledWith({ take: 25 })
    })
  })

  describe('GET /photos/:id', () => {
    it('serializes the photo', async () => {
      mockPrisma.photo.findUnique.mockResolvedValue(photoRow)

      const response = await request(app).get(`/photos/${photoRow.id}`)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.findUnique).toHaveBeenCalledWith({ where: { id: photoRow.id } })
    })

    it('answers 200 with a null resource when no photo matches', async () => {
      mockPrisma.photo.findUnique.mockResolvedValue(null)

      const response = await request(app).get(`/photos/${photoRow.id}`)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('PATCH /photos/:id', () => {
    it('updates the photo and serializes the result', async () => {
      mockPrisma.photo.findUnique.mockResolvedValue(photoRow)
      mockPrisma.photo.update.mockResolvedValue({ ...photoRow, name: 'A new name' })

      const response = await request(app)
        .patch(`/photos/${photoRow.id}`)
        .send({
          newValues: { name: 'A new name' },
          oldValues: { name: photoRow.name },
        })

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.update).toHaveBeenCalledWith({
        where: { id: photoRow.id },
        data: { name: 'A new name', updatedAt: expect.any(Date) },
      })
    })

    it('answers 409 when the old values are stale', async () => {
      mockPrisma.photo.findUnique.mockResolvedValue(photoRow)

      const response = await request(app)
        .patch(`/photos/${photoRow.id}`)
        .send({
          newValues: { name: 'A new name' },
          oldValues: { name: 'Some other name' },
        })

      expect(response.status).toBe(409)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.update).not.toHaveBeenCalled()
    })

    it('answers 400 when newValues is missing', async () => {
      const response = await request(app)
        .patch(`/photos/${photoRow.id}`)
        .send({ oldValues: { name: photoRow.name } })

      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
    })
  })

  describe('DELETE /photos/:id', () => {
    it('deletes the photo, its hash record and its S3 objects', async () => {
      mockPrisma.photo.findUnique.mockResolvedValue(photoRow)
      mockPrisma.photoHash.findUnique
        .mockResolvedValueOnce({ hash: TEST_PHOTO_HASH, _count: { photos: 1 } })
        .mockResolvedValueOnce({ hash: TEST_PHOTO_HASH, _count: { photos: 0 } })

      const response = await request(app).delete(`/photos/${photoRow.id}`)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.delete).toHaveBeenCalledWith({ where: { id: photoRow.id } })
      expect(mockPrisma.photoHash.delete).toHaveBeenCalledWith({ where: { hash: TEST_PHOTO_HASH } })
      expect(mockS3Service.deleteObjects).toHaveBeenCalledWith({
        keys: [
          `photos/${TEST_PHOTO_HASH}-xs.webp`,
          `photos/${TEST_PHOTO_HASH}-sm.webp`,
        ],
      })
    })

    it('answers 404 when no photo matches', async () => {
      mockPrisma.photo.findUnique.mockResolvedValue(null)

      const response = await request(app).delete(`/photos/${photoRow.id}`)

      expect(response.status).toBe(404)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.delete).not.toHaveBeenCalled()
    })
  })

  describe('POST /photos', () => {
    it('hashes the upload, stores every size variant and creates the photo', async () => {
      mockPrisma.photoHash.findUnique.mockResolvedValue(null)
      mockPrisma.photo.create.mockResolvedValue(photoRow)

      const response = await request(app)
        .post('/photos')
        .field('name', photoRow.name)
        .field('description', photoRow.description)
        .attach('photoFile', TEST_PHOTO_PATH)

      expect(response.status).toBe(200)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photoHash.create).toHaveBeenCalledWith({ data: { hash: TEST_PHOTO_HASH } })
      expect(mockPrisma.photo.create).toHaveBeenCalledWith({
        data: {
          contentHash: TEST_PHOTO_HASH,
          createdAt: expect.any(Date),
          description: photoRow.description,
          id: expect.any(String),
          isArchived: false,
          largestSizeAvailable: expect.any(String),
          name: photoRow.name,
          updatedAt: expect.any(Date),
        },
      })
      expect(mockS3Service.upload.mock.calls.map(([args]) => args.filePath).sort()).toMatchSnapshot()
    })

    it('answers 400 when the upload is missing', async () => {
      const response = await request(app)
        .post('/photos')
        .field('name', photoRow.name)
        .field('description', photoRow.description)

      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.create).not.toHaveBeenCalled()
    })

    it('answers 400 with the duplicates when the content hash already exists', async () => {
      mockPrisma.photoHash.findUnique.mockResolvedValue({ hash: TEST_PHOTO_HASH })
      mockPrisma.photo.findMany.mockResolvedValue([photoRow])

      const response = await request(app)
        .post('/photos')
        .field('name', photoRow.name)
        .field('description', photoRow.description)
        .attach('photoFile', TEST_PHOTO_PATH)

      expect(response.status).toBe(400)
      expect(response.body).toMatchSnapshot()
      expect(mockPrisma.photo.create).not.toHaveBeenCalled()
    })
  })
})
