import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";

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
import { Prisma } from "@prisma/client";

const job = Prisma.validator<Prisma.JobDefaultArgs>()({
  include: { createdBy: true },
});

type Job = Prisma.JobGetPayload<typeof job>;

export default function JobCard(job: Job) {
  return (
    <div className="grid grid-cols-3 gap-4 py-4">
      {jobs.map((job) => (
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
                        <DropdownMenuItem>Delete</DropdownMenuItem>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <></>
              )}
            </div>
            <CardDescription>{job.companyName}</CardDescription>
            <div className="gap-1 flex">
              <Badge className="text-xs">£{job.salaryMax}</Badge>
              <Badge className="text-xs">{job.location}</Badge>
            </div>
          </CardHeader>
          <CardFooter className="justify-between">
            <div className="font-semibold text-sm">{job.createdBy?.name!}</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Preview</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>{job.role}</DialogTitle>
                  <DialogDescription>{job.companyName}</DialogDescription>
                  <DialogDescription>
                    Salary: £{job.salaryMin} - {job.salaryMax}
                  </DialogDescription>
                  <DialogDescription>
                    Location: {job.location}
                  </DialogDescription>
                </DialogHeader>
                <div>{job.jobDescription}</div>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
