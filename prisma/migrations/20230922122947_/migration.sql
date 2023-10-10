-- DropForeignKey
ALTER TABLE "Company" DROP CONSTRAINT "Company_jobId_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "jobId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Company" ADD CONSTRAINT "Company_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;
