"use client";

import * as React from "react";

import {
  Check,
  ChevronsUpDown,
  Landmark,
  Languages,
  Target,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DeleteButton from "@/components/deleteButton";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Dialog,
  DialogClose,
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
import { NewMemberDialog } from "./newMemberDialog";
import SelectTeam from "./selectTeam";
import NewJobForm from "./newJobForm";

// const formSchema = z.object({
//   role: z.string().min(2, {
//     message: "Role must be at least 2 characters.",
//   }),
//   client: z.string(),
//   location: z
//     .string()
//     .min(2, { message: "Location must be at least 2 characters." }),
//   salaryMin: z.coerce
//     .number({ invalid_type_error: "Salary must be a number." })
//     .positive({ message: "Salary must be greater than 0" }),
//   salaryMax: z.coerce
//     .number({ invalid_type_error: "Salary must be a number." })
//     .positive(),
//   jobDescription: z.string().nonempty(),
//   remarks: z.string().optional(),
// });

export function TeamHeader() {
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [selected, setSelected] = React.useState<Job | null>(null);
  const [member, setMember] = React.useState("");
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });
  // function handleSelected(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  //   console.log(e.currentTarget.accessKey);
  //   setSelected("");
  // }
  // const form = useForm<z.infer<typeof formSchema>>({
  //   resolver: zodResolver(formSchema),
  //   defaultValues: {
  //     role: "",
  //     location: "",

  //     jobDescription: "",
  //   },
  // });
  //change query name check parallel query
  const { data: teams, status: teamQueryStatus } = useQuery({
    queryKey: ["teams", session?.user.id],
    queryFn: async () => {
      const response = await axios.get(`/api/teams/${session?.user.id}`);
      console.log("teams req");

      return response.data;
    },
    enabled: sessionStatus === "authenticated",
  });
  const { data: jobsQuery, status: queryStatus } = useQuery({
    queryKey: ["jobs", selectedTeam],
    queryFn: async () => {
      const response = await axios.get(`/api/jobs/${selectedTeam}`);
      console.log("jobs req");

      return response.data;
    },
    enabled: !!selectedTeam,
  });

  // const { mutate: addNewJob } = useMutation({
  //   mutationFn: (values: z.infer<typeof formSchema>) => {
  //     return axios.post("/api/jobs", {
  //       user: session?.user.email,
  //       job: values,
  //       team: selectedTeam,
  //     });
  //   },
  // });
  const { mutate: addMember } = useMutation({
    mutationFn: () => {
      return axios.post("/api/invites", {
        inviteeEmail: member,
        teamId: selectedTeam,
      });
    },
  });

  // function onSubmit(values: z.infer<typeof formSchema>) {
  //   addNewJob(values);
  // }

  function onMemberSubmit(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    console.log(member);
    addMember();
  }
  // console.log(selectedTeam);

  return (
    <>
      {teams && (
        <div className="grid mx-auto grid-rows-layout py-4">
          <SelectTeam
            selectedTeam={selectedTeam}
            teams={teams}
            setSelectedTeam={setSelectedTeam}
          />
          <div className="grid grid-cols-7 gap-6 grid-flow-row pb-4">
            <Tabs defaultValue="jobs" className="col-span-3">
              <TabsList>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
              </TabsList>

              <TabsContent value="jobs">
                <Dialog>
                  <DialogTrigger asChild>
                    {teams.find((team: Team) => team.id === selectedTeam) ? (
                      <Button variant="outline">New job</Button>
                    ) : (
                      <></>
                    )}
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[800px] ">
                    <DialogHeader>
                      <DialogTitle>
                        New job for{" "}
                        {
                          teams.find((team: Team) => team.id === selectedTeam)
                            ?.name
                        }
                      </DialogTitle>
                      <DialogDescription>
                        Add new job to your team here. Click "Add new job" when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <NewJobForm
                      selectedTeam={selectedTeam}
                      session={session!}
                    />
                  </DialogContent>
                </Dialog>
              </TabsContent>
              <TabsContent value="clients"></TabsContent>
              <TabsContent value="members">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Add new member</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>
                        Add new member for{" "}
                        {
                          teams.find((team: Team) => team.id === selectedTeam)
                            ?.name
                        }
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
              </TabsContent>
            </Tabs>
          </div>
          <div className="grid grid-cols-7 grid-rows-5 gap-6 grid-flow-col">
            <div className="col-span-3 row-span-full ">
              <div className="grid grid-flow-row gap-6 ">
                {queryStatus === "success" ? (
                  jobsQuery.map((job: Job) => {
                    const id = job.id;

                    return (
                      <div
                        className={cn(
                          "cursor-pointer rounded-lg",
                          selected && (selected.id === job.id ? "outline" : "")
                        )}
                        onClick={() => setSelected(job)}
                        key={job.id}
                        accessKey={job.id}
                      >
                        <Card>
                          <CardHeader>
                            <div className="flex justify-between items-baseline">
                              <CardTitle className="text-xl">
                                {job.role}
                              </CardTitle>
                              {session?.user?.email === job.createdBy?.email ? (
                                <>
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        className="p-0 h-8 w-8"
                                      >
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
                              )}
                            </div>
                            <CardDescription className="mt-0">
                              {job.clientName}
                            </CardDescription>
                            <div className="gap-1 flex">
                              <Badge className="text-xs">
                                £{job.salaryMax}
                              </Badge>
                              <Badge className="text-xs">{job.location}</Badge>
                            </div>
                          </CardHeader>
                          <CardFooter className="justify-between">
                            <div className="font-semibold text-sm">
                              {job.createdBy?.name!}
                            </div>
                          </CardFooter>
                        </Card>
                      </div>
                    );
                  })
                ) : (
                  <div>loading</div>
                )}
              </div>
            </div>
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
                  <CardContent>
                    <div className="mb-4">
                      <h1 className="font-bold text-xl">Job Description</h1>
                      <div>{selected?.jobDescription}</div>
                    </div>
                    <div className="mb-4">
                      <h1 className="font-bold text-xl">Remarks</h1>
                      <div>{selected?.remarks}</div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button variant="outline">Cancel</Button>
                    <Button>Deploy</Button>
                  </CardFooter>
                </ScrollArea>
              </Card>
            ) : (
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-4 ">
                {selected}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default TeamHeader;

{
  /* <Form {...form}>
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
                                        {clientListQuery.map((client) => (
                                          <SelectItem
                                            value={client.id}
                                            key={client.id}
                                          >
                                            {client.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>

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
                                        <Textarea
                                          className="max-h-52"
                                          {...field}
                                        />
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
                                        <Textarea
                                          className="max-h-52"
                                          {...field}
                                        />
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
                      </Form> */
}

{
  /* <>
      <div className="md:hidden">
        <Image
          src="/examples/music-light.png"
          width={1280}
          height={1114}
          alt="Music"
          className="block dark:hidden"
        />
        <Image
          src="/examples/music-dark.png"
          width={1280}
          height={1114}
          alt="Music"
          className="hidden dark:block"
        />
      </div>
      <div className="hidden md:block">
        <Menu />
        <div className="border-t">
          <div className="bg-background">
            <div className="grid lg:grid-cols-5">
              <Sidebar playlists={playlists} className="hidden lg:block" />
              <div className="col-span-3 lg:col-span-4 lg:border-l">
                <div className="h-full px-4 py-6 lg:px-8">
                  <Tabs defaultValue="music" className="h-full space-y-6">
                    <div className="space-between flex items-center">
                      <TabsList>
                        <TabsTrigger value="music" className="relative">
                          Music
                        </TabsTrigger>
                        <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
                        <TabsTrigger value="live" disabled>
                          Live
                        </TabsTrigger>
                      </TabsList>
                      <div className="ml-auto mr-4">
                        <Button>
                          <PlusCircledIcon className="mr-2 h-4 w-4" />
                          Add music
                        </Button>
                      </div>
                    </div>
                    <TabsContent
                      value="music"
                      className="border-none p-0 outline-none"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            Listen Now
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Top picks for you. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {listenNowAlbums.map((album) => (
                              <AlbumArtwork
                                key={album.name}
                                album={album}
                                className="w-[250px]"
                                aspectRatio="portrait"
                                width={250}
                                height={330}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                      <div className="mt-6 space-y-1">
                        <h2 className="text-2xl font-semibold tracking-tight">
                          Made for You
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Your personal playlists. Updated daily.
                        </p>
                      </div>
                      <Separator className="my-4" />
                      <div className="relative">
                        <ScrollArea>
                          <div className="flex space-x-4 pb-4">
                            {madeForYouAlbums.map((album) => (
                              <AlbumArtwork
                                key={album.name}
                                album={album}
                                className="w-[150px]"
                                aspectRatio="square"
                                width={150}
                                height={150}
                              />
                            ))}
                          </div>
                          <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                      </div>
                    </TabsContent>
                    <TabsContent
                      value="podcasts"
                      className="h-full flex-col border-none p-0 data-[state=active]:flex"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h2 className="text-2xl font-semibold tracking-tight">
                            New Episodes
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            Your favorite podcasts. Updated daily.
                          </p>
                        </div>
                      </div>
                      <Separator className="my-4" />
                      <PodcastEmptyPlaceholder />
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </> */
}
