-- CreateTable
CREATE TABLE "PhotoHash" (
    "hash" TEXT NOT NULL,

    CONSTRAINT "PhotoHash_pkey" PRIMARY KEY ("hash")
);

-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contentHash" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Photo" ADD CONSTRAINT "Photo_contentHash_fkey" FOREIGN KEY ("contentHash") REFERENCES "PhotoHash"("hash") ON DELETE RESTRICT ON UPDATE CASCADE;
