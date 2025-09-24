/*
  Warnings:

  - A unique constraint covering the columns `[year,sequence]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `sequence` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `year` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Invoice_invoiceNumber_idx` ON `Invoice`;

-- AlterTable
ALTER TABLE `Invoice` ADD COLUMN `sequence` INTEGER NOT NULL,
    ADD COLUMN `year` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Invoice_year_sequence_key` ON `Invoice`(`year`, `sequence`);
