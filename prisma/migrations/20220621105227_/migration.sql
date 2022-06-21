-- AlterTable
ALTER TABLE "StripeSubscription" ADD COLUMN     "upcomingQuantity" INTEGER,
ADD COLUMN     "upcomingStartDate" INTEGER,
ADD COLUMN     "upcomingStripePriceId" TEXT;

-- AddForeignKey
ALTER TABLE "StripeSubscription" ADD CONSTRAINT "StripeSubscription_upcomingStripePriceId_fkey" FOREIGN KEY ("upcomingStripePriceId") REFERENCES "StripePrice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
