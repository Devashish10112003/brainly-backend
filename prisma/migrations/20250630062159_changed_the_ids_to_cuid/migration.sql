/*
  Warnings:

  - The primary key for the `Content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ContentTag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Link` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_userId_fkey";

-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_contentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_tagId_fkey";

-- DropForeignKey
ALTER TABLE "Link" DROP CONSTRAINT "Link_contentId_fkey";

-- AlterTable
ALTER TABLE "Content" DROP CONSTRAINT "Content_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Content_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "content_id_seq";

-- AlterTable
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_pkey",
ALTER COLUMN "contentId" SET DATA TYPE TEXT,
ALTER COLUMN "tagId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("contentId", "tagId");

-- AlterTable
ALTER TABLE "Link" DROP CONSTRAINT "Link_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "contentId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Link_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "link_id_seq";

-- AlterTable
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tag_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "user_id_seq";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
