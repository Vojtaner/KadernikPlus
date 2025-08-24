/*
  Warnings:

  - You are about to drop the column `refId` on the `Subscription` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[refId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Subscription_refId_key` ON `Subscription`;

-- AlterTable
ALTER TABLE `Payment` ADD COLUMN `refId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Subscription` DROP COLUMN `refId`;

-- CreateIndex
CREATE UNIQUE INDEX `Payment_refId_key` ON `Payment`(`refId`);
