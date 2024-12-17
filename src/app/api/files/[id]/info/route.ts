import { auth } from "@/lib/auth";
import { error, json } from "@/lib/backend";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export const GET = async (
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
) => {
  const params = await context.params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return error("Unauthorized", 401);

  const file = await prisma.file.findFirst({
    where: {
      OR: [
        {
          id: params.id,
          userId: session.user.id,
        },
        {
          id: params.id,
          public: true,
        },
      ],
    },
    select: {
      name: true,
      path: true,
      type: true,
      size: true,
    },
  });

  if (!file) return error("File not found", 404);

  return json(file);
};
