import axios from "axios";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Save, UserCog2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { sample } from "./teamHeader";
import { Session } from "next-auth";
import { useState } from "react";

export function MemberCard({
  selectedTeam,
  session,
  isAdmin,
  membersQuery,
  membersStatus,
}: {
  selectedTeam: String;
  session: Session;
  isAdmin: Boolean;
  membersQuery: any;
  membersStatus: "error" | "success" | "pending";
}) {
  const queryClient = useQueryClient();
  const [edit, setEdit] = useState(false);
  // const { data: membersQuery, status: membersStatus } = useQuery({
  //   queryKey: ["members", selectedTeam],
  //   queryFn: async () => {
  //     const response = await axios.get(`/api/members/${selectedTeam}`);
  //     console.log("members req");

  //     return response.data;
  //   },
  //   enabled: !!selectedTeam,
  // });
  const { mutate: editMember, status: editMemberStatus } = useMutation({
    mutationFn: ({
      userEmail,
      value,
    }: {
      userEmail: String;
      value: string;
    }) => {
      return axios.put("/api/teams", {
        teamId: selectedTeam,
        userEmail,
        value,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", selectedTeam],
      });
    },
  });
  // console.log(`This user is admin? ${isAdmin}`);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-row justify-between items-center">
          <CardTitle>Team Members</CardTitle>
          {isAdmin &&
            (edit ? (
              <Save
                className="cursor-pointer"
                onClick={() => {
                  setEdit(!edit);
                }}
              />
            ) : (
              <UserCog2
                className="cursor-pointer"
                onClick={() => {
                  setEdit(!edit);
                }}
              />
            ))}
        </div>
        <CardDescription className="hidden lg:block">
          Invite your team members to collaborate.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-6">
        {membersQuery &&
          membersQuery.users.map((user) => {
            console.log(
              `This user is admin? ${!(
                !membersQuery.admin.some(
                  ({ id }: { id: String }) => id === user.id
                ) && edit
              )}`
            );
            return (
              <div
                key={user.id}
                className="flex items-center justify-between space-x-4"
              >
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="text-sm font-medium leading-none">
                      {user.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <Select
                  defaultValue={
                    membersQuery.admin.some(
                      ({ id }: { id: String }) => id === user.id
                    )
                      ? "admin"
                      : "member"
                  }
                  disabled={
                    (editMemberStatus === "pending" &&
                      membersStatus === "pending") ||
                    !(!(session.user.id === user.id) && edit)
                  }
                  onValueChange={(value) =>
                    editMember({ userEmail: user.email, value })
                  }
                >
                  <SelectTrigger className="ml-auto w-[110px]">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
}
