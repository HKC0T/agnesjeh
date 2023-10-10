-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_jobOwnerEmail_fkey";

-- AlterTable
ALTER TABLE "Job" ALTER COLUMN "jobOwnerEmail" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_jobOwnerEmail_fkey" FOREIGN KEY ("jobOwnerEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;
