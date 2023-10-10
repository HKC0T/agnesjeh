/*
  Warnings:

  - Added the required column `jobOwnerEmail` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "jobOwnerEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_jobOwnerEmail_fkey" FOREIGN KEY ("jobOwnerEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
