import prisma from "@/prisma/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const inviteeEmail = await body.inviteeEmail;
    const teamId = await body.teamId;

    console.log(`body: ${inviteeEmail}`);

    await prisma.invites.create({
      data: {
        teamId,
        inviteeEmail,
      },
    });
    console.log("invite sented");
    // console.log(body.user);
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
