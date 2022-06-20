/*
  Warnings:

  - You are about to drop the column `importance` on the `StripePaymentMethod` table. All the data in the column will be lost.
  - Added the required column `isDefault` to the `StripePaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "StripePaymentMethod" DROP COLUMN "importance",
ADD COLUMN     "isDefault" BOOLEAN NOT NULL;
