/*
  Warnings:

  - Made the column `body` on table `Content` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Content" ALTER COLUMN "body" SET NOT NULL;
