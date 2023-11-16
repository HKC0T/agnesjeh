import { Team } from "@prisma/client";
import { DefaultSelection } from "@prisma/client/runtime/library";
import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      teams: Team[];
      adminOf: Team[];
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    teams: Team[];
    adminOf: Team[];
  }
}
