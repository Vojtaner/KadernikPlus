/*
  Warnings:

  - You are about to drop the column `parentId` on the `Payment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Payment` DROP COLUMN `parentId`,
    ADD COLUMN `initRecurringId` VARCHAR(191) NOT NULL DEFAULT '';
