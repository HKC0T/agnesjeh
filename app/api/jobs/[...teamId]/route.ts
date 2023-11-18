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
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

const jobsWithCreatedBy = Prisma.validator<Prisma.JobInclude>()({
  createdBy: true,
});

export type JobsWithCreatedBy = Prisma.JobGetPayload<{
  include: typeof jobsWithCreatedBy;
}>;
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

export async function POST(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const body = await req.json();
    const jobId = body.jobId;
    const teamId = params.teamId;
    // const deleteJob = prisma.team.update({
    //   where: { id: String(teamId) },
    //   data: {
    //     jobs: { disconnect: { id: jobId } },
    //   },
    // });
    const deleteJob = await prisma.job.delete({
      where: { id: String(jobId) },
    });
    // console.log(jobs);
    console.log(`del${jobId}`);
    console.log(`del${deleteJob}`);
    return NextResponse.json(deleteJob, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
