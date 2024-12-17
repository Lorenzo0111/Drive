import { Files } from "@/components/pages/files";
import { Login } from "@/components/pages/login";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return <Login />;

  return <Files />;
}
