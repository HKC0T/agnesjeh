import { authConfig, loginRequiredServer } from "@/lib/auth";

import prisma from "@/prisma/db";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { getServerSession } from "next-auth";

const wait = (ms: number) => new Promise((rs) => setTimeout(rs, ms));

export default async function Home() {
  const session = await loginRequiredServer();
  const userEmail = session?.user?.email;
  const invites = await prisma.invites.findMany({
    where: { inviteeEmail: userEmail },
  });
  console.log("inv req");
  // function joinTeam(inviteId: string) {}

  await wait(1000);

  // console.log(`session: ${session}`);
  return (
    <main className="px-6 max-w-7xl lg:px-8 mx-auto h-[calc(100vh-62px)]">
      <h1>{session?.user?.id}</h1>
      <h1>{session?.user?.name}</h1>
      <h1>{session?.user?.email}</h1>
      {(session?.user?.teams).map((team) => {
        return <h1 key={team.id}>{team.name}</h1>;
      })}
      {invites.map((invite) => {
        return (
          <div key={invite.id} className="flex flex-row justify-between">
            <h1>{invite.teamId}</h1> <button>join</button>
          </div>
        );
      })}

      <div>Dashboard</div>
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

{
  /* <div className="flex flex-col py-4 ">
        <div className="flex justify-between content-center">
          <h1 className="text-4xl font-bold">Jobs</h1>
          <div>
            <a
              href="/new-job"
              className="rounded hover:bg-slate-200 p-2 font-semibold text-xs border border-slate-300"
            >
              New job
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader>
                <CardTitle className="text-xl">{job.role}</CardTitle>
                <CardDescription>{job.companyName}</CardDescription>

                <div className="gap-1 flex">
                  <Badge className="text-xs">£{job.salaryMax}</Badge>
                  <Badge className="text-xs">{job.location}</Badge>
                </div>
              </CardHeader>
              <CardFooter className="justify-end">
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
      </div> */
}
