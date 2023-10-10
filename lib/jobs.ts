"use server";
import prisma from "@/prisma/db";
import { revalidatePath } from "next/cache";

export async function deleteJob(id: number) {
  const job = await prisma.job.delete({ where: { id: id } });
  revalidatePath("/jobs");
}
