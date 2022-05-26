/*
  Warnings:

  - You are about to drop the column `subscriptionPlan` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `StripePrice` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `StripeProduct` table. All the data in the column will be lost.
  - You are about to drop the column `planType` on the `StripeSubscription` table. All the data in the column will be lost.
  - You are about to drop the column `productType` on the `StripeSubscription` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "StripeProduct_type_key";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "subscriptionPlan";

-- AlterTable
ALTER TABLE "StripePrice" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "StripeProduct" DROP COLUMN "type";

-- AlterTable
ALTER TABLE "StripeSubscription" DROP COLUMN "planType",
DROP COLUMN "productType";

-- DropEnum
DROP TYPE "SubscriptionPlanType";

-- DropEnum
DROP TYPE "SubscriptionProductType";
