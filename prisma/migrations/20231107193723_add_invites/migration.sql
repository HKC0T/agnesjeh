-- CreateTable
CREATE TABLE "Invites" (
    "id" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "InviteeId" TEXT NOT NULL,

    CONSTRAINT "Invites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Invites_teamId_InviteeId_key" ON "Invites"("teamId", "InviteeId");
