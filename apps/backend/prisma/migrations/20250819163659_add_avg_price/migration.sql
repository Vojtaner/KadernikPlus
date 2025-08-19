/*
  Warnings:

  - You are about to drop the column `price` on the `stock_items` table. All the data in the column will be lost.
  - Added the required column `avgUnitPrice` to the `stock_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_items` DROP COLUMN `price`,
    ADD COLUMN `avgUnitPrice` DECIMAL(15, 5) NOT NULL,
    ADD COLUMN `totalPrice` DECIMAL(15, 5) NOT NULL;
