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
import { zodResolver } from "@hookform/resolvers/zod";
import { Team } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  email: z.string().email(),
});

export function NewMemberDialog({
  teams,
  selectedTeam,
  isAdmin,
}: {
  teams: Team[];
  selectedTeam: String;
  isAdmin: Boolean;
}) {
  const [member, setMember] = useState("");
  const [showNewMemberForm, setShowNewMemberForm] = useState(false);
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
  const { mutate: addMember } = useMutation({
    mutationFn: () => {
      return axios.post("/api/invites", {
        inviteeEmail: member,
        teamId: selectedTeam,
      });
    },
    onSuccess: () => setShowNewMemberForm(false),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  function onMemberSubmit(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    console.log(member);
    addMember();
  }
  return (
    <Dialog open={showNewMemberForm} onOpenChange={setShowNewMemberForm}>
      <DialogTrigger asChild>
        {isAdmin && (
          <Button variant="outline" className="mb-2">
            New member
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Add new member for{" "}
            {teams.find((team: Team) => team.id === selectedTeam)?.name}
          </DialogTitle>
          <DialogDescription>
            Enter user email here. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4 py-4" onSubmit={onMemberSubmit}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Email
            </Label>
            <Input
              id="name"
              value={member}
              onChange={(e) => setMember(e.target.value)}
              className="col-span-3"
            />
          </div>
          <DialogFooter>
            <Button type="submit">Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
    // <Dialog open={showNewMemberForm} onOpenChange={setShowNewMemberForm}>
    //   <DialogTrigger asChild>
    //     <Button variant="outline">Add new member</Button>
    //   </DialogTrigger>
    //   <DialogContent className="sm:max-w-[425px]">
    //     <DialogHeader>
    //       <DialogTitle>Add new member for {team.name}</DialogTitle>
    //       <DialogDescription>
    //         Enter user email here. Click add when you're done.
    //       </DialogDescription>
    //     </DialogHeader>
    //     <div className="grid gap-4 py-4">
    //       <div className="grid grid-cols-4 items-center gap-4">
    //         <Label htmlFor="name" className="text-right">
    //           Email
    //         </Label>
    //         <Input id="name" value={member} className="col-span-3" />
    //       </div>
    //     </div>
    //     <DialogFooter>
    //       <Button type="submit">Add</Button>
    //     </DialogFooter>
    //   </DialogContent>
    // </Dialog>
  );
}
