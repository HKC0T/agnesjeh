import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/prisma/db";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";
import { Target } from "lucide-react";

const formSchema = z.object({
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  client: z.string(),
});

//need to add form validation

export default async function Page() {
  const session = await getServerSession(authConfig);
  async function addJob(formData: FormData) {
    "use server";

    const role = String(formData.get("role")).trim();
    const clientName = String(formData.get("client"));
    const location = String(formData.get("location")).trim();
    const salaryMax = Number(formData.get("salaryMax"));
    const salaryMin = Number(formData.get("salaryMin"));
    const jobDescription = String(formData.get("jobDescription"));
    const remarks = String(formData.get("remarks"));
    const jobOwnerEmail = session?.user.email;
    console.log(jobOwnerEmail);
    await prisma.job.create({
      data: {
        role,
        clientName,
        location,
        salaryMax,
        salaryMin,
        jobDescription,
        remarks,
        jobOwnerEmail,
      },
    });
    console.log("job added");
    redirect("/jobs");
  }

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  // }

  const clients = await prisma.client.findMany();

  return (
    <main className="px-6 lg:px-8 mx-auto">
      <h1 className="text-4xl font-bold text-center mt-6 tracking-tight">
        New job
      </h1>

      <form action={addJob} className="mx-auto max-w-xl mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input required type="text" name="role" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="client">Client</Label>
          <Select required name="client">
            <SelectTrigger>
              <SelectValue placeholder="Choose client" />
            </SelectTrigger>
            <SelectContent>
              {clients.map((client) => (
                <SelectItem key={client.id} value={client.name}>
                  {client.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input type="text" name="location" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMax">Maximum Salary</Label>
          <Input required type="number" name="salaryMax" min="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="salaryMin">Minium Salary</Label>
          <Input required type="number" name="salaryMin" min="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="jobDescription">Job Description</Label>
          <Textarea required name="jobDescription"></Textarea>
        </div>
        <div className="space-y-2">
          <Label htmlFor="remarks">Remarks</Label>
          <Textarea name="remarks"></Textarea>
        </div>
        <Button type="submit">Create new job</Button>
      </form>
    </main>
  );
}

//need to add button submit once only
