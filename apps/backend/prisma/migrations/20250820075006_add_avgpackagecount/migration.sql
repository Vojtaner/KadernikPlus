/*
  Warnings:

  - You are about to drop the column `avgPrice` on the `stock_items` table. All the data in the column will be lost.
  - Added the required column `avgPackageCount` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_items` DROP COLUMN `avgPrice`,
    ADD COLUMN `avgPackageCount` DECIMAL(15, 5) NOT NULL;
