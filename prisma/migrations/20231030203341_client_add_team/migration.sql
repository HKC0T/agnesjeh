/*
  Warnings:

  - The primary key for the `Client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Job` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_UserToUserGroup` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `teamId` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_UserToUserGroup" DROP CONSTRAINT "_UserToUserGroup_A_fkey";

-- DropForeignKey
ALTER TABLE "_UserToUserGroup" DROP CONSTRAINT "_UserToUserGroup_B_fkey";

-- AlterTable
ALTER TABLE "Client" DROP CONSTRAINT "Client_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Client_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Client_id_seq";

-- AlterTable
ALTER TABLE "Job" DROP CONSTRAINT "Job_pkey",
ADD COLUMN     "teamId" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Job_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Job_id_seq";

-- DropTable
DROP TABLE "UserGroup";

-- DropTable
DROP TABLE "_UserToUserGroup";

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeamToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClientToTeam" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_TeamToUser_AB_unique" ON "_TeamToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TeamToUser_B_index" ON "_TeamToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClientToTeam_AB_unique" ON "_ClientToTeam"("A", "B");

-- CreateIndex
CREATE INDEX "_ClientToTeam_B_index" ON "_ClientToTeam"("B");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeamToUser" ADD CONSTRAINT "_TeamToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToTeam" ADD CONSTRAINT "_ClientToTeam_A_fkey" FOREIGN KEY ("A") REFERENCES "Client"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClientToTeam" ADD CONSTRAINT "_ClientToTeam_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
