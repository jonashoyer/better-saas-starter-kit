/*
  Warnings:

  - Added the required column `type` to the `StripePrice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "StripePriceType" AS ENUM ('RECURRING', 'ONE_TIME');

-- AlterTable
ALTER TABLE "StripePrice" ADD COLUMN     "type" "StripePriceType" NOT NULL;
