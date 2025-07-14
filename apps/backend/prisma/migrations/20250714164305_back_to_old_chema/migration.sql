/*
  Warnings:

  - You are about to drop the column `stock_id` on the `stock_allowances` table. All the data in the column will be lost.
  - You are about to drop the `materials` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `stock_item_id` to the `stock_allowances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockId` to the `stock_items` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `materials` DROP FOREIGN KEY `materials_stockId_fkey`;

-- DropForeignKey
ALTER TABLE `stock_allowances` DROP FOREIGN KEY `stock_allowances_stock_id_fkey`;

-- DropIndex
DROP INDEX `stock_allowances_stock_id_fkey` ON `stock_allowances`;

-- AlterTable
ALTER TABLE `stock_allowances` DROP COLUMN `stock_id`,
    ADD COLUMN `stock_item_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `stock_items` ADD COLUMN `stockId` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `materials`;

-- AddForeignKey
ALTER TABLE `stock_items` ADD CONSTRAINT `stock_items_stockId_fkey` FOREIGN KEY (`stockId`) REFERENCES `stocks`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `stock_allowances` ADD CONSTRAINT `stock_allowances_stock_item_id_fkey` FOREIGN KEY (`stock_item_id`) REFERENCES `stock_items`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
