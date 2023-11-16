/*
  Warnings:

  - You are about to drop the column `CandidateId` on the `CandidateSubmitted` table. All the data in the column will be lost.
  - You are about to drop the `Candidate` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[jobId,candidateName,submittedBy]` on the table `CandidateSubmitted` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `candidateName` to the `CandidateSubmitted` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CandidateSubmitted" DROP CONSTRAINT "CandidateSubmitted_CandidateId_fkey";

-- DropIndex
DROP INDEX "CandidateSubmitted_jobId_CandidateId_key";

-- AlterTable
ALTER TABLE "CandidateSubmitted" DROP COLUMN "CandidateId",
ADD COLUMN     "candidateName" TEXT NOT NULL,
ADD COLUMN     "profileLink" TEXT;

-- DropTable
DROP TABLE "Candidate";

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSubmitted_jobId_candidateName_submittedBy_key" ON "CandidateSubmitted"("jobId", "candidateName", "submittedBy");
