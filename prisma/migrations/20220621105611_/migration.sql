/*
  Warnings:

  - The `upcomingStartDate` column on the `StripeSubscription` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "StripeSubscription" DROP COLUMN "upcomingStartDate",
ADD COLUMN     "upcomingStartDate" TIMESTAMP(3);
