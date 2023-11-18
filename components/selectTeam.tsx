"use client";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Check,
  ChevronsUpDown,
  Landmark,
  Languages,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Team } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Session } from "next-auth";

export default function SelectTeam({
  selectedTeam,
  teams,
  setSelectedTeam,
  session,
}: {
  selectedTeam: String;
  teams: Team[];
  setSelectedTeam: React.Dispatch<React.SetStateAction<string>>;
  session: Session;
}) {
  const [open, setOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState(false);
  const [showNewTeamDialog, setShowNewTeamDialog] = React.useState(false);

  const queryClient = useQueryClient();
  const { mutate: newTeam } = useMutation({
    mutationFn: () => {
      return axios.post("/api/teams", {
        admin: session.user.email,
        name: name,
      });
    },
    onSuccess: () => {
      setShowNewTeamDialog(false);
      queryClient.invalidateQueries({ queryKey: ["teams", session.user.id] });
    },
    onError: () => {
      setError(true);
    },
  });

  function onTeamSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    newTeam();
  }
  return (
    <Dialog open={showNewTeamDialog} onOpenChange={setShowNewTeamDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between min-h-[40px]"
          >
            {selectedTeam
              ? teams.find((team: Team) => team.id === selectedTeam)?.name
              : "Select team..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search team..." />
            <CommandList>
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Teams">
                {teams &&
                  teams.map((team: Team) => (
                    <CommandItem
                      key={team.id}
                      onSelect={(currentValue) => {
                        setSelectedTeam(
                          currentValue === selectedTeam
                            ? currentValue
                            : currentValue
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
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false);
                      setShowNewTeamDialog(true);
                    }}
                  >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Create Team
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create team</DialogTitle>
          <DialogDescription>
            Add a new team to manage jobs and candidates.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={(event) => onTeamSubmit(event)}>
          <div className="space-y-4 py-2 pb-4">
            <div className="space-y-2">
              <Label htmlFor="name">Team name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Team name taken. Please enter another team name.
              </AlertDescription>
            </Alert>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNewTeamDialog(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Continue</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
