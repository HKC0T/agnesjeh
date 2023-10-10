import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import prisma from "@/prisma/db";

export default async function Page() {
  const clients = await prisma.client.findMany({ include: { jobs: true } });
  return (
    <main className="px-6 max-w-7xl lg:px-8 mx-auto">
      <div className="flex flex-col py-4 ">
        <div className="flex justify-between content-center">
          <h1 className="text-4xl font-bold">Clients</h1>
          <div>
            <a href="/new-client">
              <Button variant="outline">New client</Button>
            </a>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 py-4">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader>
                <CardTitle className="text-xl">{client.name}</CardTitle>
                {client.jobs.map((job) => (
                  <div key={job.id}>{job.role}</div>
                ))}
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </main>
  );
}

// <div
//   key={company.id}
//   className="flex flex-col border-slate-300 border rounded-md p-4"
// >
//   <h2 className="font-semibold text-lg leading-none">{company.role}</h2>
//   <p className="text-xs text-slate-500 flex flex-col py-2">
//     <span>
//       {company.companyName}, {company.location}
//     </span>

//     {/* <span>
//       £{company.salaryMin}-{company.salaryMax}
//     </span> */}
//   </p>
//   <div className="text-base leading-none">£{company.salaryMax}</div>
// </div>
