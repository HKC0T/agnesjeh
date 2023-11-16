import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    // console.log(teamId);
    const members = await prisma.team.findFirst({
      where: { id: String(teamId) },
      include: {
        users: { orderBy: { name: "asc" } },
        admin: { orderBy: { name: "asc" } },
      },
    });
    // console.log("new jobs");
    return NextResponse.json(members, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
