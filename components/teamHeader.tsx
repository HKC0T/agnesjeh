"use client";

import * as React from "react";

import {
  Check,
  ChevronsUpDown,
  Landmark,
  Languages,
  Target,
  Trash2,
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

import DeleteButton from "@/components/deleteButton";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

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

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

import { useSession } from "next-auth/react";
import { Client, Job, Team } from "@prisma/client";
import {
  useQuery,
  useMutation,
  useQueries,
  QueryClient,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

import { NewMemberDialog } from "./newMemberDialog";
import SelectTeam from "./selectTeam";
import NewJobForm from "./newJobForm";
import NewCandidateForm from "./newCandidateForm";
import { MemberCard } from "./memberCard";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UserWithCandidateSubmitted } from "./userWithCandidateSubmitted";
import { JobsWithCreatedBy } from "@/app/api/jobs/[...teamId]/route";
import { UserWithCandidates } from "@/app/api/candidates/[...jobId]/route";

export function TeamHeader() {
  const [selectedTeam, setSelectedTeam] = React.useState("");
  const [selected, setSelected] = React.useState<Job | null>(null);

  const [member, setMember] = React.useState("");
  const { data: session, status: sessionStatus } = useSession({
    required: true,
  });

  const isAdmin = React.useCallback(() => {
    return session!.user.adminOf.some(({ id }) => id === selectedTeam);
  }, [selectedTeam, session]);
  //need invalidate after teams or edit
  const queryClient = useQueryClient();
  const { data: teams, status: teamQueryStatus } = useQuery({
    queryKey: ["teams", session?.user.id],

    queryFn: async () => {
      const response = await axios.get(`/api/teams/${session?.user.id}`);
      console.log("teams req");

      console.log("default team");
      setSelectedTeam(response.data[0].id);

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
  const { mutate: deleteJob, status: deleteStatus } = useMutation({
    mutationFn: (id: String) => {
      console.log(id);
      return axios.post(`/api/jobs/teamId/${selectedTeam}`, { jobId: id });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs", selectedTeam] });
    },
  });

  const { data: candidatesQuery, status: candidatesStatus } = useQuery({
    queryKey: ["candidates", selected ? selected.id : ""],
    queryFn: async () => {
      const response = await axios.get(
        `/api/candidates/${selected ? selected.id : ""}`
      );
      console.log("cans req");

      return response.data;
    },
    enabled: !!selected,
  });

  const { mutate: addMember } = useMutation({
    mutationFn: () => {
      return axios.post("/api/invites", {
        inviteeEmail: member,
        teamId: selectedTeam,
      });
    },
  });
  const { data: membersQuery, status: membersStatus } = useQuery({
    queryKey: ["members", selectedTeam],
    queryFn: async () => {
      const response = await axios.get(`/api/members/${selectedTeam}`);
      console.log("members req");

      return response.data;
    },
    enabled: !!selectedTeam,
  });

  const { data: clientListQuery, status: clientListQueryStatus } = useQuery({
    queryKey: ["clients", selectedTeam],
    queryFn: async () => {
      const response = await axios.get(`/api/clients/${selectedTeam}`);
      console.log("client req");
      return response.data;
    },
    enabled: !!selectedTeam,
  });

  // console.log(selectedTeam);

  return (
    <>
      {session && (
        <SelectTeam
          selectedTeam={selectedTeam}
          teams={teams}
          setSelectedTeam={setSelectedTeam}
          session={session!}
        />
      )}
      {teams && (
        <>
          <div className="flex flex-row min-h-[calc(100%-40px)] py-3">
            <div className="flex flex-grow min-h-[calc(100%-40px)] w-1/3">
              {/* <div className="flex"></div> */}
              <Tabs defaultValue="jobs" className="flex flex-col min-w-full">
                <div className="flex  justify-between items-center">
                  <TabsList className="max-w-fit my-2">
                    <TabsTrigger value="jobs">Jobs</TabsTrigger>

                    <TabsTrigger value="team">Team</TabsTrigger>
                  </TabsList>
                  <TabsContent value="jobs">
                    <NewJobForm
                      selectedTeam={selectedTeam}
                      session={session!}
                      isAdmin={isAdmin()}
                      teams={teams}
                      clientListQuery={clientListQuery}
                      clientListQueryStatus={clientListQueryStatus}
                    />
                  </TabsContent>
                  <TabsContent value="team">
                    <NewMemberDialog
                      teams={teams}
                      selectedTeam={selectedTeam}
                      isAdmin={isAdmin()}
                    />
                  </TabsContent>
                </div>

                <TabsContent
                  value="jobs"
                  className="flex max-h-[calc(100%-56px)]  flex-grow-0 "
                >
                  {jobsQuery && (
                    <div className="grid grid-cols-3 grid-flow-col gap-4 min-w-full max-h-full mt-2">
                      <ScrollArea className="max-h-full p-2 rounded-lg border bg-card text-card-foreground shadow-sm col-span-3 ">
                        {jobsQuery.length > 0 ? (
                          <div className="grid grid-flow-row grid-cols-1 gap-4 p-2">
                            {queryStatus === "success" ? (
                              jobsQuery.map((job: JobsWithCreatedBy) => {
                                const id = job.id;

                                return (
                                  <div
                                    className={cn(
                                      "cursor-pointer rounded-lg",
                                      selected &&
                                        (selected.id === job.id
                                          ? "outline"
                                          : "")
                                    )}
                                    onClick={() => setSelected(job)}
                                    key={job.id}
                                    accessKey={job.id}
                                  >
                                    <Card>
                                      <CardHeader>
                                        <div className="flex justify-between items-center">
                                          <CardTitle className="text-xl">
                                            {job.role}
                                          </CardTitle>
                                          {session?.user?.email ===
                                          job.createdBy?.email ? (
                                            <>
                                              <Trash2
                                                className="hover:bg-accent h-10 w-10 p-2 rounded-md"
                                                onClick={() =>
                                                  deleteJob(job.id)
                                                }
                                              />
                                              {/* <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                  <Button
                                                    variant="ghost"
                                                    className="p-0 h-8 w-8"
                                                  >
                                                    <DotsHorizontalIcon className="h-4 w-4 " />
                                                  </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                  className="w-4"
                                                  align="end"
                                                  forceMount
                                                >
                                                  <DropdownMenuGroup>
                                                    <DropdownMenuItem>
                                                      <DeleteButton
                                                        id={job.id}
                                                      />
                                                    </DropdownMenuItem>
                                                  </DropdownMenuGroup>
                                                </DropdownMenuContent>
                                              </DropdownMenu> */}
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
                                          <Badge className="text-xs">
                                            {job.location}
                                          </Badge>
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
                        ) : (
                          <h1 className="text-center">There is no jobs.</h1>
                        )}
                      </ScrollArea>
                    </div>
                  )}
                </TabsContent>
                <TabsContent
                  value="team"
                  className="flex max-h-[calc(100%-56px)]  flex-grow-0"
                >
                  <div className="grid grid-cols-3 grid-flow-col gap-4 min-w-full max-h-full">
                    <ScrollArea className="max-h-full rounded-lg border bg-card text-card-foreground shadow-sm col-span-3 ">
                      {membersStatus === "success" && (
                        <MemberCard
                          selectedTeam={selectedTeam}
                          session={session!}
                          isAdmin={isAdmin()}
                          membersQuery={membersQuery}
                          membersStatus={membersStatus}
                        />
                      )}
                    </ScrollArea>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="flex flex-grow ml-4 max-h-[calc(100%-40px)] w-2/3">
              <Tabs defaultValue="details" className="flex flex-col min-w-full">
                <div className="flex justify-between items-center">
                  <TabsList className="max-w-fit my-2">
                    <TabsTrigger value="details">Details</TabsTrigger>

                    <TabsTrigger value="candidates">Candidates</TabsTrigger>
                  </TabsList>
                  {selected && (
                    <TabsContent value="candidates">
                      <NewCandidateForm
                        selected={selected}
                        session={session!}
                      />
                    </TabsContent>
                  )}
                </div>

                <TabsContent
                  value="details"
                  className="flex max-h-[calc(100%-56px)]  flex-grow-0"
                >
                  {selected ? (
                    <div className="grid grid-cols-3 grid-flow-col gap-4 min-w-full max-h-full mt-2">
                      <ScrollArea className="max-h-full rounded-lg border bg-card text-card-foreground col-span-3">
                        <Card className="min-h-full col-span-3">
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
                              <h1 className="font-bold text-xl">
                                Job Description
                              </h1>
                              <div>{selected?.jobDescription}</div>
                            </div>
                            <div className="mb-4">
                              <h1 className="font-bold text-xl">Remarks</h1>
                              <div>{selected?.remarks}</div>
                            </div>
                          </CardContent>
                        </Card>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-3">
                      {selected}
                    </div>
                  )}
                </TabsContent>
                <TabsContent
                  value="candidates"
                  className="flex max-h-[calc(100%-56px)]  flex-grow-0"
                >
                  {selected ? (
                    <div className="grid grid-cols-3 grid-flow-col gap-4 min-w-full min-h-full ">
                      <ScrollArea className="max-h-full rounded-lg border bg-card text-card-foreground col-span-3 mb-2">
                        <Card className="min-h-full col-span-3">
                          <CardHeader>
                            <CardTitle>{selected.role}</CardTitle>
                            <CardDescription>
                              {selected?.clientName}, {selected?.location}
                            </CardDescription>
                            <CardDescription>
                              £{selected?.salaryMin}-{selected?.salaryMax}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <h1 className="font-bold text-xl">Candidates</h1>
                            {candidatesQuery &&
                              candidatesQuery.map(
                                (user: UserWithCandidates) => {
                                  return (
                                    <Card key={user.email} className="p-2 mt-4">
                                      <UserWithCandidateSubmitted user={user} />
                                    </Card>
                                  );
                                }
                              )}
                          </CardContent>
                          {/* <CardFooter className="flex justify-between">
                            <Button variant="outline">Cancel</Button>
                            <Button>Deploy</Button>
                          </CardFooter> */}
                        </Card>
                      </ScrollArea>
                    </div>
                  ) : (
                    <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-3">
                      {selected}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default TeamHeader;

export const sample = `
What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Why do we use it?

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

Where does it come from?

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.
What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Why do we use it?

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

Where does it come from?

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.What is Lorem Ipsum?

Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
Why do we use it?

It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).

Where does it come from?

Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.

The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.`;

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
