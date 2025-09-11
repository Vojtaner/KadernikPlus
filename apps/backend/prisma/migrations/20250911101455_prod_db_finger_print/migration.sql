/*
  Warnings:

  - You are about to drop the column `userId` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `avgUnitPrice` on the `stock_allowances` table. All the data in the column will be lost.
  - You are about to drop the column `stockItemName` on the `stock_allowances` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Team` DROP FOREIGN KEY `Team_userId_fkey`;

-- DropIndex
DROP INDEX `Team_userId_fkey` ON `Team`;

-- AlterTable
ALTER TABLE `Team` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `stock_allowances` DROP COLUMN `avgUnitPrice`,
    DROP COLUMN `stockItemName`;
