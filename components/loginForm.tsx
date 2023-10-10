"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  csrftoken?: string;
}

export function LoginForm(props: LoginFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    const res = await signIn("credentials", {
      username: data.get("username"),
      password: data.get("password"),
      redirect: false,
    });

    if (res && !res.error) {
      router.push("/");
    } else {
      console.log("error");
      setError("Incorrect Username or Password");
    }
  };
  return (
    <main className="px-6 lg:px-8 mx-auto">
      <h1 className="text-4xl font-bold text-center mt-6">Login</h1>
      {error && <span>{error}</span>}
      <form onSubmit={handleSubmit} className="mx-auto max-w-xl mt-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input required type="text" name="username" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input required type="text" name="password" />
        </div>
        <div className="flex justify-between">
          <a
            href="/register"
            className="font-semibold text-sm flex items-center"
          >
            Create an account
          </a>
          <Button type="submit">Login</Button>
        </div>
      </form>
    </main>
  );
}
