// export async function GET(req: Request) {
//   console.log("api");
//   return new Response("HIIIII");
// }
// export async function POST(req: Request) {
//   const body = await req.json();
//   console.log(body);
//   return new Response(JSON.stringify(body));
// }

import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    const jobs = await prisma.job.findMany({
      where: { team: { id: String(teamId) } },
      include: { createdBy: true },
      orderBy: { createdAt: "desc" },
    });
    // console.log(jobs);
    // console.log("new jobs");
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
