/*
  Warnings:

  - Added the required column `contentHash` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "contentHash" VARCHAR(32) NOT NULL;
