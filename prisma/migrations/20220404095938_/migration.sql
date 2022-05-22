/*
  Warnings:

  - The `subscriptionPlan` column on the `Project` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `subscriptionPlan` on the `StripeSubscription` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "SubscriptionPlanType" AS ENUM ('FREE', 'BASIC', 'PREMIUM');

-- CreateEnum
CREATE TYPE "SubscriptionProductType" AS ENUM ('PLAN', 'ADD_ON');

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "subscriptionPlan",
ADD COLUMN     "subscriptionPlan" "SubscriptionPlanType" NOT NULL DEFAULT E'FREE';

-- AlterTable
ALTER TABLE "StripeSubscription" DROP COLUMN "subscriptionPlan",
ADD COLUMN     "planType" "SubscriptionPlanType",
ADD COLUMN     "productType" "SubscriptionProductType";

-- DropEnum
DROP TYPE "SubscriptionPlan";
