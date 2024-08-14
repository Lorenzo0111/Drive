import { authenticated, error, json, parseBody } from "@/lib/backend";
import { prisma } from "@/lib/prisma";
import { upload } from "@/lib/storage";
import { z } from "zod";

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

const createFolderSchema = z
  .object({
    name: z.string().min(1).max(255),
    parent: z.string().optional(),
  })
  .transform((data) => ({
    name: data.name.trim().replaceAll("/", "_").replaceAll(" ", "_"),
    parent: data.parent && data.parent !== "/" ? data.parent : undefined,
  }));
export const PUT = authenticated(async (req) => {
  try {
    const data = await parseBody(req, createFolderSchema);

    if (data.parent && data.parent !== "/") {
      const parent = await prisma.file.findFirst({
        where: {
          path: data.parent,
          userId: req.auth.user.id,
        },
        select: {
          id: true,
          folder: true,
        },
      });

      if (!parent || !parent.folder) return error("Invalid parent", 400);
    }

    const file = await prisma.file.create({
      data: {
        name: data.name,
        size: 0,
        type: "folder",
        folder: true,
        userId: req.auth.user.id,
        parentId: data.parent,
        path:
          data.parent && data.parent !== "/"
            ? `${data.parent}/${data.name}`
            : `/${data.name}`,
      },
    });

    return json(file);
  } catch (e) {
    console.log(e)
    return error("Invalid body", 400);
  }
});
