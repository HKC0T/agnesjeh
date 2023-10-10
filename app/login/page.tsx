import prisma from "@/prisma/db";
import { LoginForm } from "@/components/loginForm";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/authButtons";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Page() {
  return (
    <main className="px-6 max-w-7xl lg:px-8 mx-auto flex justify-center my-6">
      <Card className="">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Log in</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid grid-cols-2 gap-6">
            <Button variant="outline">
              <Icons.gitHub className="mr-2 h-4 w-4" />
              Github
            </Button>
            <GoogleButton />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Create account</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
