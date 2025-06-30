/*
  Warnings:

  - You are about to drop the `ContentTag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_contentId_fkey";

-- DropForeignKey
ALTER TABLE "ContentTag" DROP CONSTRAINT "ContentTag_tagId_fkey";

-- DropTable
DROP TABLE "ContentTag";

-- DropTable
DROP TABLE "Tag";
