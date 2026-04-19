/*
  Warnings:

  - Added the required column `baseCalculoSnapshot` to the `RetencionISLR` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RetencionISLR" ADD COLUMN     "baseCalculoSnapshot" DECIMAL(18,2) NOT NULL;
