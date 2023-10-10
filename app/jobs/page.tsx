import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  Cloud,
  CreditCard,
  Ghost,
  Github,
  Keyboard,
  LifeBuoy,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";
import DeleteButton from "@/components/deleteButton";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import Link from "next/link";

import prisma from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authConfig } from "@/lib/auth";

export default async function Page() {
  const jobs = await prisma.job.findMany({ include: { createdBy: true } });
  const session = await getServerSession(authConfig);
  return (
    <main className="px-6 max-w-7xl lg:px-8 mx-auto">
      <div className="flex flex-col py-4 ">
        <div className="flex justify-between content-center">
          <h1 className="text-4xl font-bold">Jobs</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">New job</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mx-6">
              <DropdownMenuLabel>New job for</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuGroup>
                <Link href="/jobs/new-job">
                  <DropdownMenuItem className="cursor-pointer">
                    <span className="cursor-pointer">New Client</span>
                  </DropdownMenuItem>
                </Link>

                <Link href="/jobs/new-job-existing">
                  <DropdownMenuItem className="cursor-pointer">
                    <span>Existing Client</span>
                  </DropdownMenuItem>
                </Link>
                {/* <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <span className="cursor-pointer">Existing Client</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>
                        <span>Email</span>
                      </DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub> 
                #edit later 
                */}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          {jobs.map((job) => {
            const id = job.id;

            return (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-baseline">
                    <CardTitle className="text-xl">{job.role}</CardTitle>
                    {session?.user?.email === job.createdBy?.email ? (
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
                    )}
                  </div>
                  <CardDescription
                    className="
                  "
                  >
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
                        <DialogDescription>{job.clientName}</DialogDescription>
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
            );
          })}
        </div>
      </div>
    </main>
  );
}

// <div
//   key={job.id}
//   className="flex flex-col border-slate-300 border rounded-md p-4"
// >
//   <h2 className="font-semibold text-lg leading-none">{job.role}</h2>
//   <p className="text-xs text-slate-500 flex flex-col py-2">
//     <span>
//       {job.companyName}, {job.location}
//     </span>

//     {/* <span>
//       £{job.salaryMin}-{job.salaryMax}
//     </span> */}
//   </p>
//   <div className="text-base leading-none">£{job.salaryMax}</div>
// </div>
