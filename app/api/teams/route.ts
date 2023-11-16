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

export async function GET() {
  try {
    const teams = await prisma.team.findMany({ include: { jobs: true } });
    return NextResponse.json(teams, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = await body.name;
    const admin = await body.admin;
    // console.log(`body: ${body.job.client}`);

    console.log(body.name);
    await prisma.team.create({
      data: {
        name,
        users: { connect: { email: String(admin) } },
        admin: { connect: { email: String(admin) } },
      },
      include: {
        admin: true,
        users: true,
      },
    });

    // console.log(body.user);
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const userEmail = await body.userEmail;
    const value = await body.value;
    const teamId = await body.teamId;
    console.log(`api ${value}`);
    if (value == "admin") {
      await prisma.team.update({
        where: { id: String(teamId) },
        data: {
          admin: { connect: { email: userEmail } },
        },
      });
    } else {
      await prisma.team.update({
        where: { id: String(teamId) },
        data: {
          admin: { disconnect: { email: userEmail } },
        },
      });
    }
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
