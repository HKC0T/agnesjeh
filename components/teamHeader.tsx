"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Target } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteButton from "@/components/deleteButton";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
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
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import prisma from "@/prisma/db";
import { useSession } from "next-auth/react";
import { Client, Job, Team } from "@prisma/client";
import { useQuery, useMutation, useQueries } from "@tanstack/react-query";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitHandler } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface TeamHeaderProps {
  teams: Team[];
  jobs: Job[];
}

const formSchema = z.object({
  role: z.string().min(2, {
    message: "Role must be at least 2 characters.",
  }),
  client: z.string().nonempty(),
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

const TeamHeader: React.FC<TeamHeaderProps> = ({ teams, jobs }) => {
  const [open, setOpen] = React.useState(false);
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [selected, setSelected] = React.useState<Job | null>(null);
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });
  // function handleSelected(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  //   console.log(e.currentTarget.accessKey);
  //   setSelected("");
  // }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      role: "",
      location: "",

      jobDescription: "",
    },
  });
  const { data: jobsQuery, status: queryStatus } = useQuery({
    queryKey: ["jobs"],
    queryFn: async () => {
      const response = await axios.get("/api/jobs");
      return response.data;
    },
  });
  const {
    data: clientListQuery,
    status: clientListQueryStatusm,
    isLoading,
  } = useQuery({
    queryKey: ["clients", selectedTeam],
    queryFn: async () => {
      const response = await axios.get(`/api/clients/${selectedTeam}`);
      return response.data;
    },
    enabled: !!selectedTeam,
  });

  const { mutate: addNewJob } = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      return axios.post("/api/jobs", {
        user: session?.user.email,
        job: values,
        team: selectedTeam,
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    addNewJob(values);
  }
  // console.log(selectedTeam);

  return (
    <div className="flex flex-col h-full mx-auto">
      <div className="flex py-4 ">
        <h1>
          {/* className="text-4xl font-bold" */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-[200px] justify-between"
              >
                {selectedTeam
                  ? teams.find((team) => team.id === selectedTeam)?.name
                  : "Select team..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search team..." />
                <CommandEmpty>No team found.</CommandEmpty>
                <CommandGroup>
                  {teams.map((team) => (
                    <CommandItem
                      key={team.id}
                      onSelect={(currentValue) => {
                        setSelectedTeam(
                          currentValue === selectedTeam ? "" : currentValue
                        );
                        setOpen(false);
                      }}
                      value={team.id}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedTeam === team.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {team.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </h1>
        <div className="flex flex-1 justify-center">
          <Tabs defaultValue="jobs" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              {/* <TabsTrigger value="overview">Overview</TabsTrigger> */}
              <TabsTrigger value="jobs">Jobs</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>
            {/* <TabsContent value="overview"></TabsContent> */}
            <TabsContent value="jobs"></TabsContent>
            <TabsContent value="clients"></TabsContent>
          </Tabs>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            {teams.find((team) => team.id === selectedTeam) ? (
              <Button variant="outline">New job</Button>
            ) : (
              <></>
            )}
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px] ">
            <DialogHeader>
              <DialogTitle>
                New job for{" "}
                {teams.find((team) => team.id === selectedTeam)?.name}
              </DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "w-[200px] justify-between",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value
                                    ? clientListQuery.find(
                                        (client) => client.id === field.id
                                      )?.name
                                    : "Select client"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput placeholder="Search client..." />
                                <CommandEmpty>No client found.</CommandEmpty>
                                <CommandGroup>
                                  {clientListQuery.map((client) => (
                                    <CommandItem
                                      value={client.id}
                                      key={client.id}
                                      onSelect={() => {
                                        form.setValue("client", client.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          client.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {client.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>

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
      </div>
      <div className="grid grid-cols-7 gap-6 grid-flow-col">
        <ScrollArea className="col-span-3 row-span-full">
          <div className="grid grid-flow-row gap-6">
            {queryStatus === "success" ? (
              jobsQuery.map((job: Job) => {
                const id = job.id;

                return (
                  <div
                    className="cursor-pointer"
                    onClick={() => setSelected(job)}
                    key={job.id}
                    accessKey={job.id}
                  >
                    <Card className="">
                      <CardHeader>
                        <div className="flex justify-between items-baseline">
                          <CardTitle className="text-xl">{job.role}</CardTitle>
                          {/* {session?.user?.email === job.createdBy?.email ? (
                      <>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="p-0 h-8 w-8">
                              <DotsHorizontalIcon className="h-4 w-4 " />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent
                            className="w-56"
                            align="end"
                            forceMount
                          >
                            <DropdownMenuGroup>
                              <DropdownMenuItem>
                                <DeleteButton id={id} />
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </>
                    ) : (
                      <></>
                    )} */}
                        </div>
                        <CardDescription className="mt-0">
                          {job.clientName}
                        </CardDescription>
                        <div className="gap-1 flex">
                          <Badge className="text-xs">£{job.salaryMax}</Badge>
                          <Badge className="text-xs">{job.location}</Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="justify-between">
                        <div className="font-semibold text-sm">
                          {job.createdBy?.name!}
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">Preview</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>{job.role}</DialogTitle>
                              <DialogDescription>
                                {job.clientName}
                              </DialogDescription>
                              <DialogDescription>
                                Salary: £{job.salaryMin} - {job.salaryMax}
                              </DialogDescription>
                              <DialogDescription>
                                Location: {job.location}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="whitespace-pre-line text-sm">
                              {job.jobDescription}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </CardFooter>
                    </Card>
                  </div>
                );
              })
            ) : (
              <div>loading</div>
            )}
          </div>
        </ScrollArea>
        {selected ? (
          <Card className="col-span-4 row-span-full">
            <ScrollArea className="">
              <CardHeader>
                <CardTitle>{selected?.role}</CardTitle>
                <CardDescription>
                  {selected?.clientName}, {selected?.location}
                </CardDescription>
                <CardDescription>
                  £{selected?.salaryMin}-{selected?.salaryMax}
                </CardDescription>
              </CardHeader>
              {/* <CardContent className="">{sample}</CardContent> */}
              <CardFooter className="flex justify-between">
                <Button variant="outline">Cancel</Button>
                <Button>Deploy</Button>
              </CardFooter>
            </ScrollArea>
          </Card>
        ) : (
          <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-4 ">
            {sample}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamHeader;
const sample = `Creative Writing Generating random paragraphs can be an
excellent way for writers to get their creative flow going at
the beginning of the day. The writer has no idea what topic the
random paragraph will be about when it appears. This forces the
writer to use creativity to complete one of three common writing
challenges. The writer can use the paragraph as the first one of
a short story and build upon it. A second option is to use the
random paragraph somewhere in a short story they create. The
third option is to have the random paragraph be the ending
paragraph in a short story. No matter which of these challenges
is undertaken, the writer is forced to use creativity to
incorporate the paragraph into their writing. Tackle Writers'
Block A random paragraph can also be an excellent way for a
writer to tackle writers' block. Writing block can often happen
due to being stuck with a current project that the writer is
trying to complete. By inserting a completely random paragraph
from which to begin, it can take down some of the issues that
may have been causing the writers' block in the first place.
Beginning Writing Routine Another productive way to use this
tool to begin a daily writing routine. One way is to generate a
random paragraph with the intention to try to rewrite it while
still keeping the original meaning. The purpose here is to just
get the writing started so that when the writer goes onto their
day's writing projects, words are already flowing from their
fingers.Creative Writing Generating random paragraphs can be an
excellent way for writers to get their creative flow going at
the beginning of the day. The writer has no idea what topic the
random paragraph will be about when it appears. This forces the
writer to use creativity to complete one of three common writing
challenges. The writer can use the paragraph as the first one of
a short story and build upon it. A second option is to use the
random paragraph somewhere in a short story they create. The
third option is to have the random paragraph be the ending
paragraph in a short story. No matter which of these challenges
is undertaken, the writer is forced to use creativity to
incorporate the paragraph into their writing. Tackle Writers'
Block A random paragraph can also be an excellent way for a
writer to tackle writers' block. Writing block can often happen
due to being stuck with a current project that the writer is
trying to complete. By inserting a completely random paragraph
from which to begin, it can take down some of the issues that
may have been causing the writers' block in the first place.
Beginning Writing Routine Another productive way to use this
tool to begin a daily writing routine. One way is to generate a
random paragraph with the intention to try to rewrite it while
still keeping the original meaning. The purpose here is to just
get the writing started so that when the writer goes onto their
day's writing projects, words are already flowing from their
fingers.Creative Writing Generating random paragraphs can be an
excellent way for writers to get their creative flow going at
the beginning of the day. The writer has no idea what topic the
random paragraph will be about when it appears. This forces the
writer to use creativity to complete one of three common writing
challenges. The writer can use the paragraph as the first one of
a short story and build upon it. A second option is to use the
random paragraph somewhere in a short story they create. The
third option is to have the random paragraph be the ending
paragraph in a short story. No matter which of these challenges
is undertaken, the writer is forced to use creativity to
incorporate the paragraph into their writing. Tackle Writers'
Block A random paragraph can also be an excellent way for a
writer to tackle writers' block. Writing block can often happen
due to being stuck with a current project that the writer is
trying to complete. By inserting a completely random paragraph
from which to begin, it can take down some of the issues that
may have been causing the writers' block in the first place.
Beginning Writing Routine Another productive way to use this
tool to begin a daily writing routine. One way is to generate a
random paragraph with the intention to try to rewrite it while
still keeping the original meaning. The purpose here is to just
get the writing started so that when the writer goes onto their
day's writing projects, words are already flowing from their
fingers.Creative Writing Generating random paragraphs can be an
excellent way for writers to get their creative flow going at
the beginning of the day. The writer has no idea what topic the
random paragraph will be about when it appears. This forces the
writer to use creativity to complete one of three common writing
challenges. The writer can use the paragraph as the first one of
a short story and build upon it. A second option is to use the
random paragraph somewhere in a short story they create. The
third option is to have the random paragraph be the ending
paragraph in a short story. No matter which of these challenges
is undertaken, the writer is forced to use creativity to
incorporate the paragraph into their writing. Tackle Writers'
Block A random paragraph can also be an excellent way for a
writer to tackle writers' block. Writing block can often happen
due to being stuck with a current project that the writer is
trying to complete. By inserting a completely random paragraph
from which to begin, it can take down some of the issues that
may have been causing the writers' block in the first place.
Beginning Writing Routine Another productive way to use this
tool to begin a daily writing routine. One way is to generate a
random paragraph with the intention to try to rewrite it while
still keeping the original meaning. The purpose here is to just
get the writing started so that when the writer goes onto their
day's writing projects, words are already flowing from their
fingers.Creative Writing Generating random paragraphs can be an
excellent way for writers to get their creative flow going at
the beginning of the day. The writer has no idea what topic the
random paragraph will be about when it appears. This forces the
writer to use creativity to complete one of three common writing
challenges. The writer can use the paragraph as the first one of
a short story and build upon it. A second option is to use the
random paragraph somewhere in a short story they create. The
third option is to have the random paragraph be the ending
paragraph in a short story. No matter which of these challenges
is undertaken, the writer is forced to use creativity to
incorporate the paragraph into their writing. Tackle Writers'
Block A random paragraph can also be an excellent way for a
writer to tackle writers' block. Writing block can often happen
due to being stuck with a current project that the writer is
trying to complete. By inserting a completely random paragraph
from which to begin, it can take down some of the issues that
may have been causing the writers' block in the first place.
Beginning Writing Routine Another productive way to use this
tool to begin a daily writing routine. One way is to generate a
random paragraph with the intention to try to rewrite it while
still keeping the original meaning. `;

{
  /* <form onSubmit={handleSubmit}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 items-center gap-8">
                  <div className="grid items-center gap-4">
                    <Label htmlFor="role">Role</Label>
                    <Input name="role" className="" />
                  </div>
                  <div className="grid items-center gap-4">
                    <Label htmlFor="location">Location</Label>
                    <Input name="location" className="" />
                  </div>
                  <div className="grid items-center gap-4">
                    <Label htmlFor="salaryMin">Minium Salary</Label>
                    <Input
                      required
                      type="number"
                      name="salaryMin"
                      min="0"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid items-center gap-4">
                    <Label htmlFor="salaryMax">Maximum Salary</Label>
                    <Input
                      required
                      type="number"
                      name="salaryMax"
                      min="0"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid items-center gap-4 col-span-2">
                    <Label htmlFor="jobDescription">Job Description</Label>
                    <Textarea
                      required
                      name="jobDescription"
                      className="max-h-52"
                    ></Textarea>
                  </div>
                  <div className="grid items-center gap-4 col-span-2">
                    <Label htmlFor="remarks">Remarks</Label>
                    <Textarea name="remarks" className="max-h-52"></Textarea>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Add new job</Button>
              </DialogFooter>
            </form> */
}
