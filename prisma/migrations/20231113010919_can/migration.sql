/*
  Warnings:

  - You are about to drop the column `inviteeId` on the `Invites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,inviteeEmail]` on the table `Invites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteeEmail` to the `Invites` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('URGENT', 'NORMAL');

-- CreateEnum
CREATE TYPE "Active" AS ENUM ('ACTIVE', 'CLOSED');

-- DropIndex
DROP INDEX "Invites_teamId_inviteeId_key";

-- AlterTable
ALTER TABLE "Invites" DROP COLUMN "inviteeId",
ADD COLUMN     "inviteeEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "active" "Active" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "status" "JobStatus" NOT NULL DEFAULT 'NORMAL';

-- CreateTable
CREATE TABLE "Candidate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "ProfileLink" TEXT,

    CONSTRAINT "Candidate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CandidateSubmitted" (
    "jobId" TEXT NOT NULL,
    "CandidateId" TEXT NOT NULL,
    "submittedBy" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TeamAdmin" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CandidateSubmitted_jobId_CandidateId_key" ON "CandidateSubmitted"("jobId", "CandidateId");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamAdmin_AB_unique" ON "_TeamAdmin"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamAdmin_B_index" ON "_TeamAdmin"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Invites_teamId_inviteeEmail_key" ON "Invites"("teamId", "inviteeEmail");

-- AddForeignKey
ALTER TABLE "Invites" ADD CONSTRAINT "Invites_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invites" ADD CONSTRAINT "Invites_inviteeEmail_fkey" FOREIGN KEY ("inviteeEmail") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmitted" ADD CONSTRAINT "CandidateSubmitted_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmitted" ADD CONSTRAINT "CandidateSubmitted_CandidateId_fkey" FOREIGN KEY ("CandidateId") REFERENCES "Candidate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CandidateSubmitted" ADD CONSTRAINT "CandidateSubmitted_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamAdmin" ADD CONSTRAINT "_TeamAdmin_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamAdmin" ADD CONSTRAINT "_TeamAdmin_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
