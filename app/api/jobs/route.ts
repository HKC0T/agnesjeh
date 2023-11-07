import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const formData = await body.job;
    // console.log(`body: ${body.job.client}`);

    const role = String(formData.role).trim();
    const clientName = String(formData.client);
    const location = String(formData.location).trim();
    const salaryMax = Number(formData.salaryMax);
    const salaryMin = Number(formData.salaryMin);
    const jobDescription = String(formData.jobDescription);
    const remarks = String(formData.remarks);
    const jobOwnerEmail = String(body.user);
    const teamId = String(body.team);
    // console.log(jobOwnerEmail);
    await prisma.job.create({
      data: {
        role,
        client: { connect: { id: clientName } },
        location,
        salaryMax,
        salaryMin,
        jobDescription,
        remarks,
        team: { connect: { id: teamId } },
        createdBy: { connect: { email: jobOwnerEmail } },
      },
      include: {
        client: true,
        createdBy: true,
        team: true,
      },
    });
    console.log("job added");
    // console.log(body.user);
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
