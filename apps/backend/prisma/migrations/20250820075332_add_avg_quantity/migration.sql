/*
  Warnings:

  - You are about to drop the column `avgPackageCount` on the `stock_items` table. All the data in the column will be lost.
  - Added the required column `avgQuantity` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_items` DROP COLUMN `avgPackageCount`,
    ADD COLUMN `avgQuantity` DECIMAL(15, 5) NOT NULL;
