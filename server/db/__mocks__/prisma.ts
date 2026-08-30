export const prisma = {
  photo: {
    create: jest.fn(),
    delete: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  photoHash: {
    create: jest.fn(),
    delete: jest.fn(),
    findUnique: jest.fn(),
  },
}
