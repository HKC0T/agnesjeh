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
    session: async ({ session, token }) => {
      // console.log("sess", { token, session });
      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.teams = token.teams;
      }

      return session;
    },
    async jwt({ token, user }) {
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
        include: {
          teams: true,
        },
      });
      if (!dbUser) {
        token.id = user!.id;
        return token;
      }
      // console.log("jwt", { token, user });
      // console.log("test", dbUser.teams);

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        teams: dbUser.teams,
      };
    },
    // async redirect(params: { url: string }) {
    //   const { url } = params;

    //   // url is just a path, e.g.: /videos/pets
    //   if (!url.startsWith("http")) {
    //     console.log("not http ", url);
    //     return url;
    //   }

    //   // If we have a callback use only its relative path
    //   const callbackUrl = new URL(url).searchParams.get("callbackUrl");
    //   if (!callbackUrl) {
    //     console.log("not callback ", url);

    //     return url;
    //   }
    //   console.log("callback", new URL(callbackUrl as string).pathname);

    //   return new URL(callbackUrl as string).pathname;
    // },
    // async jwt({token, user}) {

    // }
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // pages: {
  //   signIn: "/login",
  // },
};

export async function loginRequiredServer() {
  const session = await getServerSession(authConfig);
  if (!session) return redirect("/login");
  return session;
}
