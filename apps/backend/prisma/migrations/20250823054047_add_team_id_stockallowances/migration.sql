/*
  Warnings:

  - Added the required column `team_id` to the `stock_allowances` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `stock_allowances` ADD COLUMN `team_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `stock_allowances` ADD CONSTRAINT `stock_allowances_team_id_fkey` FOREIGN KEY (`team_id`) REFERENCES `Team`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
