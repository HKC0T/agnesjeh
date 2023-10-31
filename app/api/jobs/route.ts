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
    const jobs = await prisma.job.findMany({ include: { createdBy: true } });
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log(`body: ${body}`);
    // console.log(body);
    return NextResponse.json(body, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "failed." }, { status: 500 });
  }
}
