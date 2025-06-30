-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" INTEGER NOT NULL,
    "hash" TEXT NOT NULL,
    "contentId" INTEGER NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentTag" (
    "contentId" INTEGER NOT NULL,
    "tagId" INTEGER NOT NULL,

    CONSTRAINT "ContentTag_pkey" PRIMARY KEY ("contentId","tagId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Link_hash_key" ON "Link"("hash");

-- CreateIndex
CREATE UNIQUE INDEX "Link_contentId_key" ON "Link"("contentId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "Content"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContentTag" ADD CONSTRAINT "ContentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
