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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Client, Team } from "@prisma/client";
import { Session } from "next-auth";
import { useState } from "react";

const formSchema = z.object({
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  client: z.string(),
  location: z
    .string()
    .min(2, { message: "Location must be at least 2 characters." }),
  salaryMin: z.coerce
    .number({ invalid_type_error: "Salary must be a number." })
    .positive({ message: "Salary must be greater than 0" }),
  salaryMax: z.coerce
    .number({ invalid_type_error: "Salary must be a number." })
    .positive(),
  jobDescription: z.string().nonempty(),
  remarks: z.string().optional(),
});

export default function NewJobForm({
  selectedTeam,
  session,
  isAdmin,
  teams,
  clientListQuery,
  clientListQueryStatus,
}: {
  selectedTeam: String;
  session: Session;
  isAdmin: Boolean;
  teams: Team[];
  clientListQuery: any;
  clientListQueryStatus: "error" | "success" | "pending";
}) {
  const [showNewJobForm, setShowNewJobForm] = useState(false);
  const [newClient, setNewClient] = useState(false);

  const queryClient = useQueryClient();

  // const {
  //   data: clientListQuery,
  //   status: clientListQueryStatus,
  // } = useQuery({
  //   queryKey: ["clients", selectedTeam],
  //   queryFn: async () => {
  //     const response = await axios.get(`/api/clients/${selectedTeam}`);
  //     console.log("client req");
  //     return response.data;
  //   },
  //   enabled: !!selectedTeam,
  // });

  const { mutate: addNewJob, status: newJobStatus } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post("/api/jobs", {
        user: session?.user.email,
        job: values,
        team: selectedTeam,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", selectedTeam] });
      setShowNewJobForm(false);
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      location: "",
      client: "",
      salaryMax: 0,
      salaryMin: 0,
      jobDescription: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNewJob(values);
  }

  return (
    <>
      {teams && (
        <Dialog open={showNewJobForm} onOpenChange={setShowNewJobForm}>
          <DialogTrigger asChild>
            {isAdmin &&
              (teams.find((team: Team) => team.id === selectedTeam) ? (
                <Button variant="outline" className="mb-2">
                  New job
                </Button>
              ) : (
                <></>
              ))}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] ">
            <DialogHeader>
              <DialogTitle>
                New job for{" "}
                {teams.find((team: Team) => team.id === selectedTeam)?.name}
              </DialogTitle>
              <DialogDescription>
                Add new job to your team here. Click "Add new job" when you're
                done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 items-center gap-8">
                    <FormField
                      control={form.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem className="col-span-2">
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="client"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <div className="flex flex-row">
                            {newClient ? (
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            ) : (
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select an existing client" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {clientListQueryStatus === "success" ? (
                                    clientListQuery.map((client: Client) => (
                                      <SelectItem
                                        value={client.name}
                                        key={client.id}
                                      >
                                        {client.name}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <div>loading...</div>
                                  )}
                                </SelectContent>
                              </Select>
                            )}
                            <Button
                              variant={"outline"}
                              className="ml-2"
                              type="button"
                              onClick={() => {
                                setNewClient(!newClient);
                                form.resetField("client");
                              }}
                            >
                              {newClient ? "New" : "Existing"}
                            </Button>
                          </div>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salaryMin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Minimun Salary</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="salaryMax"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Maximun Salary</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="jobDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Job Description</FormLabel>
                            <FormControl>
                              <Textarea className="max-h-52" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="col-span-2">
                      <FormField
                        control={form.control}
                        name="remarks"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remarks</FormLabel>
                            <FormControl>
                              <Textarea className="max-h-52" {...field} />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add new job</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
