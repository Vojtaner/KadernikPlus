-- DropForeignKey
ALTER TABLE `Payment` DROP FOREIGN KEY `Payment_subscriptionId_fkey`;

-- AlterTable
ALTER TABLE `Payment` MODIFY `subscriptionId` VARCHAR(191) NULL,
    MODIFY `initRecurringId` VARCHAR(191) NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `Payment` ADD CONSTRAINT `Payment_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
