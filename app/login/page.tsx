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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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
          <div className="grid  gap-6">
            <GoogleButton />
          </div>
          {/* <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with demo account
              </span>
            </div>
          </div> */}

          {/* <div className="grid gap-2">
            <Label htmlFor="email">Username</Label>
            <Input id="email" type="email" placeholder="admin" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="admin" />
          </div> */}
        </CardContent>
        <CardFooter>
          <Button className="w-full">Login</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
