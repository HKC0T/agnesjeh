import prisma from "@/prisma/db";
import { NextResponse, NextRequest } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";

export async function GET(
  req: Request,
  { params }: { params: { teamId: string } }
) {
  try {
    const teamId = params.teamId;
    // console.log(teamId);
    // const test = await prisma.client.findMany({
    //   where: { teams: { some: { id: String(teamId) } } },
    //   include: { teams: true },
    // });
    const clients = await prisma.client.findMany({
      where: { teams: { some: { id: String(teamId) } } },
    });
    // console.log(teamId);
    // const clients = await prisma.client.findMany({
    //   where: { teams: { some: { id: String(teamId) } } },
    //   include: { teams: true },
    // });

    // const {teamId} = req.body
    // console.log(clients);
    // const clients = await prisma.client.findMany({
    //   include: { teams: { where: { id: teamId } } },
    // });
    // console.log(clients);
    return NextResponse.json(clients, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        message: "This team has no clients",
      },
      { status: 500 }
    );
  }
}
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     console.log(`body: ${body.team}`);
//     // console.log(body);
//     return NextResponse.json(body, { status: 200 });
//   } catch (error) {
//     return NextResponse.json({ message: "failed." }, { status: 500 });
//   }
// }
