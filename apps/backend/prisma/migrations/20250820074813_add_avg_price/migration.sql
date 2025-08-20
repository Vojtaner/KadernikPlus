/*
  Warnings:

  - Added the required column `avgPrice` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_items` ADD COLUMN `avgPrice` DECIMAL(15, 5) NOT NULL;
