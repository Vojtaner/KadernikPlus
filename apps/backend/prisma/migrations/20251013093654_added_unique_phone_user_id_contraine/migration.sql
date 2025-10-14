/*
  Warnings:

  - A unique constraint covering the columns `[userId,phone]` on the table `clients` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `clients_phone_key` ON `clients`;

-- CreateIndex
CREATE UNIQUE INDEX `clients_userId_phone_key` ON `clients`(`userId`, `phone`);
