import prisma from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: Request,
  { params }: { params: { inviteeEmail: string } }
) {
  try {
    const inviteeEmail = params.inviteeEmail;
    // console.log(teamId);
    // const test = await prisma.client.findMany({
    //   where: { teams: { some: { id: String(teamId) } } },
    //   include: { teams: true },
    // });
    const invites = await prisma.invites.findMany({
      where: { inviteeEmail: String(inviteeEmail) },
      include: { from: true },
    });
    console.log(invites);

    return NextResponse.json(invites, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "This team has no clients",
      },
      { status: 500 }
    );
  }
}
export async function POST(
  req: Request,
  { params }: { params: { inviteeEmail: string } }
) {
  try {
    const inviteeEmail = params.inviteeEmail;

    const body = await req.json();
    const id = await body.invite.id;
    const choice = await body.invite.choice;

    console.log(`body: ${body.invite.choice}`);

    if (choice) {
      const teamId = body.invite.team;
      const accept = await prisma.team.update({
        where: { id: String(teamId) },
        data: { users: { connect: { email: String(inviteeEmail) } } },
      });
      console.log(`accepte:${accept}`);
    }
    const removeInvite = await prisma.invites.delete({ where: { id: id } });
    console.log(`invite deleted ${removeInvite}`);
    //change invites schema to 2 1t1 realtions
    return NextResponse.json({ message: "joined." }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
