/*
  Warnings:

  - You are about to drop the column `contentId` on the `Link` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Link` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ContentType" AS ENUM ('NOTE', 'LINK', 'TWEET', 'VIDEO', 'DOCUMENT');

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_contentId_fkey";

-- DropIndex
DROP INDEX "Link_contentId_key";

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "body" TEXT,
ADD COLUMN     "type" "ContentType" NOT NULL,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "contentId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Link_userId_key" ON "Link"("userId");

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
