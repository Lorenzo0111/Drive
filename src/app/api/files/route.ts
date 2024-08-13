import { authenticated, error, json } from "@/lib/backend";
import { prisma } from "@/lib/prisma";
import { upload } from "@/lib/storage";

export const GET = authenticated(async (req) => {
  const files = await prisma.file.findMany({
    where: {
      userId: req.auth.user.id,
    },
  });

  return json(files);
});

export const POST = authenticated(async (req) => {
  const data = await req.formData();
  const file = data.get("file");

  if (!file || !(file instanceof File)) return error("No file provided", 400);

  const res = await upload(file, req.auth.user.id);
  const record = await prisma.file.create({
    data: {
      name: res.name,
      size: res.size,
      type: res.type,
      path: res.path,
      userId: req.auth.user.id,
    },
  });

  return json(record, 201);
});
