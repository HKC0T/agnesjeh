import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const jobId = params.jobId;
    // const candidates = await prisma.candidateSubmitted.groupBy({
    //   by: ["submittedBy"],
    //   where: { jobId: String(jobId) },
    //   _count: true,
    // });
    // const candidates = await prisma.candidateSubmitted.findMany({
    //   where: { jobId: String(jobId) },
    //   include: { user: true },
    // });
    console.log("can get");
    const candidates = await prisma.user.findMany({
      select: {
        name: true,
        email: true,
        candidateSubmitted: {
          where: { jobId: String(jobId) },
          select: { candidateName: true, profileLink: true },
        },
      },
    });
    return NextResponse.json(candidates, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { jobId: string } }
) {
  try {
    const body = await req.json();
    const formData = await body.candidate;
    const submittedBy = await body.user;
    const jobId = params.jobId;
    const candidateName = String(formData.candidateName).trim();
    const profileLink = String(formData.profileLink).trim();
    console.log(`body: ${candidateName}`);

    // console.log(jobOwnerEmail);
    await prisma.candidateSubmitted.create({
      data: {
        job: { connect: { id: String(jobId) } },
        user: { connect: { email: submittedBy } },
        candidateName,
        profileLink,
      },
      include: {
        job: true,
        user: true,
      },
    });

    console.log("can added");
    // console.log(body.user);
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
