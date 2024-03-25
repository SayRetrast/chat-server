/*
  Warnings:

  - You are about to drop the column `fromUserId` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the column `toUserId` on the `Messages` table. All the data in the column will be lost.
  - Added the required column `dialogId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_fromUserId_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_toUserId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "fromUserId",
DROP COLUMN "toUserId",
ADD COLUMN     "dialogId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Dialogs" (
    "dialogId" TEXT NOT NULL,
    "userOneId" TEXT NOT NULL,
    "userTwoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Dialogs_pkey" PRIMARY KEY ("dialogId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Dialogs_dialogId_key" ON "Dialogs"("dialogId");

-- AddForeignKey
ALTER TABLE "Dialogs" ADD CONSTRAINT "Dialogs_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Dialogs" ADD CONSTRAINT "Dialogs_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_dialogId_fkey" FOREIGN KEY ("dialogId") REFERENCES "Dialogs"("dialogId") ON DELETE RESTRICT ON UPDATE CASCADE;
