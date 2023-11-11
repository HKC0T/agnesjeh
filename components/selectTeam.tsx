"use client";
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
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronsUpDown,
  Landmark,
  Languages,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";
import { Team } from "@prisma/client";

export default function SelectTeam({
  selectedTeam,
  teams,
  setSelectedTeam,
}: {
  selectedTeam: String;
  teams: Team[];
  setSelectedTeam: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex">
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
                ? teams.find((team: Team) => team.id === selectedTeam)?.name
                : "Select team..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search team..." />
              <CommandEmpty>No team found.</CommandEmpty>
              <CommandGroup heading="Teams">
                {teams.map((team: Team) => (
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
    </div>
  );
}
