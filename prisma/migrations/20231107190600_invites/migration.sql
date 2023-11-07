/*
  Warnings:

  - You are about to drop the `_TeamToUser` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `adminIds` to the `Team` table without a default value. This is not possible if the table is not empty.
  - Added the required column `memberId` to the `Team` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_TeamToUser" DROP CONSTRAINT "_TeamToUser_B_fkey";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "adminIds" TEXT NOT NULL,
ADD COLUMN     "inviteeId" TEXT,
ADD COLUMN     "memberId" TEXT NOT NULL;

-- DropTable
DROP TABLE "_TeamToUser";

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_inviteeId_fkey" FOREIGN KEY ("inviteeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_adminIds_fkey" FOREIGN KEY ("adminIds") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
