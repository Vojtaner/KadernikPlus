/*
  Warnings:

  - A unique constraint covering the columns `[refId]` on the table `Subscription` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Subscription` ADD COLUMN `refId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Subscription_refId_key` ON `Subscription`(`refId`);
