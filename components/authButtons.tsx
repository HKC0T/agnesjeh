"use client";
import { signIn } from "next-auth/react";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";

export function GoogleButton() {
  const handleClick = () => {
    signIn("google");
  };
  return (
    <Button variant="outline" onClick={handleClick}>
      <Icons.google className="mr-2 h-4 w-4" />
      Google
    </Button>
  );
}
