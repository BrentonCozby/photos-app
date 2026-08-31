const client = {
  photo: {
    count: jest.fn(),
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

export type T_TransactionCallback = (tx: typeof client) => Promise<unknown>

export const prisma = {
  ...client,
  $transaction: jest.fn<Promise<unknown>, [T_TransactionCallback]>(),
}
