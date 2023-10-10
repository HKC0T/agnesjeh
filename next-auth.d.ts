import { DefaultSelection } from "@prisma/client/runtime/library";
import { DefaultSession } from "next-auth";
import NextAuth from "next-auth/next";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      groups: string;
    } & DefaultSession["user"];
  }
}
