"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Team } from "@prisma/client";
import { useState } from "react";

// const formSchema = z.object({
//   role: z.string().min(2, {
//     //   message: "Role must be at least 2 characters.",
//   }),
// });

export function NewMemberDialog(team: Team) {
  const [member, setMember] = useState("");
  // const { mutate: addNewJob } = useMutation({
  //     mutationFn: (values: z.infer<typeof formSchema>) => {
  //       return axios.post("/api/jobs", {
  //         user: session?.user.email,
  //         job: values,
  //         team: selectedTeam,
  //       });
  //     },
  //   });

  //   function onSubmit(values: z.infer<typeof formSchema>) {
  //     addNewJob(values);
  //   }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Add new member</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add new member for {team.name}</DialogTitle>
          <DialogDescription>
            Enter user email here. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input id="name" value={member} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Add</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
