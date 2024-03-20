/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `RefreshTokens` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RefreshTokens" DROP COLUMN "expiresAt";
