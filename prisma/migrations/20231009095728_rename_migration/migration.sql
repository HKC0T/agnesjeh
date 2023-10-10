/*
  Warnings:

  - You are about to drop the column `companyName` on the `Job` table. All the data in the column will be lost.
  - You are about to drop the `Company` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `clientName` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_companyName_fkey";

-- AlterTable
ALTER TABLE "Job" 
RENAME COLUMN "companyName" TO "clientName";

-- DropTable
DROP TABLE "Company";

-- CreateTable
CREATE TABLE "Cilent" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Cilent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cilent_name_key" ON "Cilent"("name");

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_clientName_fkey" FOREIGN KEY ("clientName") REFERENCES "Cilent"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
