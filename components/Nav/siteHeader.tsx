"use client";
import { LogOutIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { AccountMenu } from "./accountMenu";

export function SiteHeader() {
  const { data: session, status } = useSession();
  return (
    <header className="border-b-2">
      <nav className="mx-auto flex items-center justify-between px-6  max-w-7xl lg:px-8">
        <div className="flex items-center gap-x-6 py-4">
          <Link href="/" className="text-lg font-bold">
            AgnesJeh
          </Link>
        </div>
        <div className="flex items-center gap-x-4 text-xs font-medium">
          {session && (
            <>
              <InvitesMenu />

              <AccountMenu session={session} />
            </>
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
      <LogOutIcon />
    </button>
  );
}
