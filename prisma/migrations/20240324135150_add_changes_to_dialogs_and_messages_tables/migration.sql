/*
  Warnings:

  - A unique constraint covering the columns `[userOneId,userTwoId]` on the table `Dialogs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Messages" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Dialogs_userOneId_userTwoId_key" ON "Dialogs"("userOneId", "userTwoId");

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
