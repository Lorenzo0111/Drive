"use client";

import { authClient } from "@/lib/auth.client";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

export function Login() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Welcome!</CardTitle>
          <CardDescription>
            Please login to continue into your drive.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();

              const data = await authClient.signIn.social({
                provider: "github",
              });

              console.log(data);
            }}
          >
            <Button className="w-full">Login</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
