/*
  Warnings:

  - You are about to drop the column `userId` on the `Messages` table. All the data in the column will be lost.
  - You are about to drop the `Dialogs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `fromUserId` to the `Messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `toUserId` to the `Messages` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_dialogId_fkey";

-- DropForeignKey
ALTER TABLE "Messages" DROP CONSTRAINT "Messages_userId_fkey";

-- AlterTable
ALTER TABLE "Messages" DROP COLUMN "userId",
ADD COLUMN     "fromUserId" TEXT NOT NULL,
ADD COLUMN     "toUserId" TEXT NOT NULL;

-- DropTable
DROP TABLE "Dialogs";

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Messages" ADD CONSTRAINT "Messages_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "Users"("userId") ON DELETE RESTRICT ON UPDATE CASCADE;
