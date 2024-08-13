import { Files } from "@/components/pages/files";
import { Login } from "@/components/pages/login";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  if (!session) return <Login />;

  return <Files />;
}
