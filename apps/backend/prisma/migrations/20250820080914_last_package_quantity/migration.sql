/*
  Warnings:

  - You are about to drop the column `avgQuantity` on the `stock_items` table. All the data in the column will be lost.
  - Added the required column `lastPackageQuantity` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_items` DROP COLUMN `avgQuantity`,
    ADD COLUMN `lastPackageQuantity` DECIMAL(15, 5) NOT NULL;
