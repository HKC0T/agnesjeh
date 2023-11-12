"use client";

import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { InvitesMenu } from "./invitesMenu";

export function SiteHeader() {
  const { data: session, status } = useSession();
  return (
    <header className="border-b-2">
      <nav className="mx-auto flex items-center justify-between px-6  max-w-7xl lg:px-8">
        <div className="flex items-center gap-x-6 py-4">
          <Link href="/" className="text-lg font-bold">
            AgnesJeh
          </Link>
          <h1>{session?.user?.name}</h1>
        </div>
        <div className="flex items-center gap-x-2 text-xs font-medium">
          {session ? (
            <>
              <InvitesMenu />

              <LogOut />
            </>
          ) : (
            status !== "loading" && <LogIn />
          )}
        </div>
      </nav>
    </header>
  );
}

function LogIn() {
  return (
    <Link href="/login" className="headerButton">
      Log In
    </Link>
  );
}

function LogOut() {
  return (
    <button
      className="headerButton"
      onClick={
        () => signOut()
        //{ callbackUrl: "/login" }
      }
    >
      Log Out
    </button>
  );
}
