-- AlterTable
ALTER TABLE `Team` ADD COLUMN `userId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `stock_allowances` ADD COLUMN `avgUnitPrice` DECIMAL(15, 5) NOT NULL DEFAULT 0.00000,
    ADD COLUMN `stockItemName` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `Team` ADD CONSTRAINT `Team_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
