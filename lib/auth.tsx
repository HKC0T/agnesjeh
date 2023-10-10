import { NextAuthOptions, User, getServerSession } from "next-auth";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

import prisma from "@/prisma/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Session } from "inspector";

export const authConfig: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    // CredentialsProvider({
    //   name: "Credentials",
    //   credentials: {
    //     username: { label: "Username", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     if (!credentials || !credentials.username || !credentials.password) {
    //       console.log(`authfail: ${credentials}`);
    //       return null;
    //     }
    //     const dbUser = await prisma.user.findFirst({
    //       where: { username: credentials.username },
    //     });
    //     if (dbUser && dbUser.password === credentials.password) {
    //       const { password, ...user } = dbUser;
    //       console.log(`user: ${user.name}`);

    //       return user as User;
    //     }
    //     console.log("auth:");
    //     return null;
    //   },
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, user }) => {
      if (session?.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

export async function loginRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");
  return session;
}
