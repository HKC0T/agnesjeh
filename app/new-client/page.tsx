import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import prisma from "@/prisma/db";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
const formSchema = z.object({
  name: z.string().min(2, {
    message: "Client name must be at least 2 characters.",
  }),
});

export default async function Page() {
  async function addClient(formData: FormData) {
    "use server";
    const name = String(formData.get("name"));

    await prisma.client.create({
      data: {
        name,
      },
    });
    console.log("client added");
    redirect("/clients");
  }

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   console.log(values);
  // }

  console.log();
  return (
    <main className="px-6 lg:px-8 mx-auto">
      <h1 className="text-4xl font-bold text-center mt-6">New client</h1>
      <form action={addClient} className="mx-auto max-w-xl mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input required type="text" name="name" />
        </div>

        <Button type="submit">Create new client</Button>
      </form>
    </main>
  );
}
