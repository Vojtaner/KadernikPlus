/*
  Warnings:

  - Added the required column `price` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_items` ADD COLUMN `price` INTEGER NOT NULL;
