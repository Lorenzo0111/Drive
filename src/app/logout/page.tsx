import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signOut } from "@/lib/auth";
import { redirect } from "next/navigation";

export default function Logout() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>Logout</CardTitle>
          <CardDescription>Click the button below to logout.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            action={async () => {
              "use server";

              await signOut();
              return redirect("/");
            }}
          >
            <Button className="w-full">Logout</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
