/*
  Warnings:

  - You are about to drop the column `externalId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Payment_externalId_key` ON `Payment`;

-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `externalId`;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_transactionId_key` ON `Payment`(`transactionId`);
