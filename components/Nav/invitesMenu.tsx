"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, MailWarning } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { X } from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { sample } from "../teamHeader";
import { cn } from "@/lib/utils";
import { Invites } from "@/app/api/invites/[...inviteeEmail]/route";

export function InvitesMenu() {
  const { data: session } = useSession();
  const email = session?.user.email;
  const queryClient = useQueryClient();

  const {
    data: invites,
    status,
    isSuccess,
  } = useQuery({
    queryKey: ["invites", email],
    queryFn: async (): Promise<Invites[]> => {
      const response = await axios.get(`/api/invites/${email}`);
      console.log(`inv req ${email}`);

      return response.data;
    },
    enabled: !!email,
  });

  const { mutate: inviteResponse, status: inviteResponseStataus } = useMutation(
    {
      mutationFn: (invite: { id: string; team: string; choice: boolean }) => {
        return axios.post(`/api/invites/${email}`, { invite });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["invites", email] });
      },
    }
  );
  //   console.log(data.user.email);
  return (
    <>
      {status === "success" && (
        <DropdownMenu>
          <DropdownMenuTrigger>
            {invites.length > 0 ? (
              <MailWarning className="focus:ring-0" />
            ) : (
              <Mail className="focus:ring-0" />
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="mr-8 ">
            <ScrollArea className="h-72 w-56 rounded-md border">
              {/* <DropdownMenuLabel>Invites</DropdownMenuLabel>
          // <DropdownMenuSeparator />
          {status === "success" &&
            invites.map((invite) => {
              return (
                <DropdownMenuItem key={invite.id}>
                  {invite.from.name}
                </DropdownMenuItem>
              );
            })} */}
              <div className="p-4">
                <h1 className="mb-4 text-base font-semibold leading-none">
                  Invites
                </h1>

                {status === "success" &&
                  invites.map((invite) => (
                    <>
                      <div
                        key={invite.id}
                        className="text-sm flex justify-between items-center"
                      >
                        {invite.from.name}
                        <div className="flex flex-row">
                          <button
                            value="accept"
                            onClick={() =>
                              inviteResponse({
                                id: invite.id,
                                team: invite.from.id,
                                choice: true,
                              })
                            }
                          >
                            <Check
                              size={24}
                              className="mr-2 hover:bg-accent p-1 "
                            />
                          </button>
                          <button
                            value="decline"
                            onClick={() =>
                              inviteResponse({
                                id: invite.id,
                                team: invite.from.id,
                                choice: false,
                              })
                            }
                            disabled={!(inviteResponseStataus === "success")}
                          >
                            <X size={24} className="hover:bg-accent p-1 " />
                          </button>
                        </div>
                      </div>
                      <Separator className="my-2" />
                    </>
                  ))}
              </div>
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  );
}
