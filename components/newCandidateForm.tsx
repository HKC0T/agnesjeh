"use client";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  UseMutateFunction,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosResponse } from "axios";
import { Client, Job } from "@prisma/client";
import { Session } from "next-auth";
import { useState } from "react";

const formSchema = z.object({
  candidateName: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),

  profileLink: z.string().optional(),
});

export default function NewCandidateForm({
  selected,
  session,
}: {
  selected: Job;
  session: Session;
}) {
  const [showNewCandidateForm, setShowNewCandidateForm] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      candidateName: "",
      profileLink: "",
    },
  });
  const queryClient = useQueryClient();

  const { mutate: addNewCandidate } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post(`/api/candidates/${selected.id}`, {
        user: session?.user.email,
        candidate: values,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["candidates", selected.id] });
      setShowNewCandidateForm(false);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNewCandidate(values);
  }

  return (
    <>
      {
        <Dialog
          open={showNewCandidateForm}
          onOpenChange={setShowNewCandidateForm}
        >
          <DialogTrigger asChild>
            <Button variant="outline" className="mb-2">
              New candidate
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add new candidate for {selected.role}</DialogTitle>
              <DialogDescription>
                Enter candidate name and profile link here. Click add when
                you're done.
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-4 ">
                  <FormField
                    control={form.control}
                    name="candidateName"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="profileLink"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Profile link</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Optional" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter className="mt-4">
                  <Button type="submit">Add candidate</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      }
    </>
  );
}
