-- CreateTable
CREATE TABLE "Photo" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(128) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" VARCHAR(255) NOT NULL,
    "description" VARCHAR(255) NOT NULL,

    CONSTRAINT "Photo_pkey" PRIMARY KEY ("id")
);
