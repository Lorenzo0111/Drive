import { authenticated, error, json } from "@/lib/backend";
import { prisma } from "@/lib/prisma";

export const GET = authenticated(async (req, { params }) => {
  if (!params?.id || typeof params.id !== "string")
    return error("Invalid file id", 400);

  const file = await prisma.file.findFirst({
    where: {
      OR: [
        {
          id: params.id,
          userId: req.auth.user.id,
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
});
