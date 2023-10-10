/*
  Warnings:

  - You are about to drop the `_CompanyToJob` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `companyId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_CompanyToJob" DROP CONSTRAINT "_CompanyToJob_A_fkey";

-- DropForeignKey
ALTER TABLE "_CompanyToJob" DROP CONSTRAINT "_CompanyToJob_B_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "companyId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_CompanyToJob";

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
