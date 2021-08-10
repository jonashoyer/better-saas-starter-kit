/*
  Warnings:

  - You are about to drop the column `metadata` on the `Session` table. All the data in the column will be lost.
  - The `role` column on the `UserProject` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "ProjectRole" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "ProductPrice" DROP CONSTRAINT "ProductPrice_productId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "UserProject" DROP COLUMN "role",
ADD COLUMN     "role" "ProjectRole" NOT NULL DEFAULT E'USER';

-- DropEnum
DROP TYPE "UserRole";

-- AddForeignKey
ALTER TABLE "ProductPrice" ADD FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
