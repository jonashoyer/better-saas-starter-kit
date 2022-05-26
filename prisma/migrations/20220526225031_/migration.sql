/*
  Warnings:

  - You are about to drop the column `productId` on the `StripePrice` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StripePrice" DROP CONSTRAINT "StripePrice_productId_fkey";

-- AlterTable
ALTER TABLE "StripePrice" DROP COLUMN "productId",
ADD COLUMN     "stripeProductId" TEXT;

-- AddForeignKey
ALTER TABLE "StripePrice" ADD CONSTRAINT "StripePrice_stripeProductId_fkey" FOREIGN KEY ("stripeProductId") REFERENCES "StripeProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;
