import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronsUpDown, Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Job } from "@prisma/client";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function CandidateSubmitted({ user }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="w-full space-y-2"
      >
        <div className="flex items-center justify-between space-x-4 px-4">
          <h4
            className={
              (cn("text-sm font-semibold "),
              user.candidateSubmitted.length === 0
                ? "text-muted-foreground opacity-50"
                : "")
            }
          >
            {user.name} ({user.email}) submitted{" "}
            {user.candidateSubmitted.length} candidates
          </h4>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="w-9 p-0"
              disabled={user.candidateSubmitted.length === 0}
            >
              <ChevronsUpDown className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        {/* <div className="rounded-md border px-4 py-3 font-semibold text-m">
          {user.candidateSubmitted.length} candidates
        </div> */}
        {user.candidateSubmitted.map((candidate) => {
          return (
            <CollapsibleContent
              key={candidate.candidateName + user.email}
              className="space-y-2"
            >
              <div className="rounded-md border px-4 py-3  text-sm">
                {candidate.profileLink ? (
                  <a
                    href={String(candidate.profileLink)}
                    target="_blank"
                    className="underline"
                  >
                    {candidate.candidateName}
                  </a>
                ) : (
                  candidate.candidateName
                )}
                {}
              </div>
            </CollapsibleContent>
          );
        })}
      </Collapsible>
    </>
  );
}
