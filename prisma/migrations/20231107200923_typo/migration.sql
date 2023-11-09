/*
  Warnings:

  - You are about to drop the column `InviteeId` on the `Invites` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[teamId,inviteeId]` on the table `Invites` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `inviteeId` to the `Invites` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Invites_teamId_InviteeId_key";

-- AlterTable
ALTER TABLE "Invites" DROP COLUMN "InviteeId",
ADD COLUMN     "inviteeId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invites_teamId_inviteeId_key" ON "Invites"("teamId", "inviteeId");
