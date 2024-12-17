import { auth } from "@/lib/auth";
import { error, json, parseBody } from "@/lib/backend";
import { prisma } from "@/lib/prisma";
import { upload } from "@/lib/storage";
import { headers } from "next/headers";
import { NextRequest } from "next/server";
import { z } from "zod";

export const GET = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return error("Unauthorized", 401);

  const parent = req.nextUrl.searchParams.get("parent") || "/";
  const parentFile = await prisma.file.findFirst({
    where: {
      path: parent,
      userId: session.user.id,
      folder: true,
    },
  });

  const files = await prisma.file.findMany({
    where: {
      userId: session.user.id,
      parentId: parentFile?.id || null,
    },
  });

  return json(files);
};

export const POST = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return error("Unauthorized", 401);

  const data = await req.formData();
  const file = data.get("file");

  if (!file || !(file instanceof File)) return error("No file provided", 400);

  const parent = data.get("parent") as string | null;
  let parentId;

  if (parent && parent !== "/") {
    const parentFile = await prisma.file.findFirst({
      where: {
        path: parent,
        userId: session.user.id,
        folder: true,
      },
      select: {
        id: true,
      },
    });

    if (!parentFile) return error("Invalid parent", 400);

    parentId = parentFile.id;
  }

  const res = await upload(file, session.user.id);
  const record = await prisma.file.create({
    data: {
      name: res.name,
      size: res.size,
      type: res.type,
      path: res.path,
      userId: session.user.id,
      parentId,
    },
  });

  return json(record, 201);
};

const createFolderSchema = z
  .object({
    name: z.string().min(1).max(255),
    parent: z.string().optional(),
  })
  .transform((data) => ({
    name: data.name.trim().replaceAll("/", "_").replaceAll(" ", "_"),
    parent: data.parent && data.parent !== "/" ? data.parent : undefined,
  }));
export const PUT = async (req: NextRequest) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) return error("Unauthorized", 401);

  try {
    const data = await parseBody(req, createFolderSchema);
    let parentId;

    if (data.parent && data.parent !== "/") {
      const parent = await prisma.file.findFirst({
        where: {
          path: data.parent,
          userId: session.user.id,
          folder: true,
        },
        select: {
          id: true,
        },
      });

      if (!parent) return error("Invalid parent", 400);

      parentId = parent.id;
    }

    const file = await prisma.file.create({
      data: {
        name: data.name,
        size: 0,
        type: "folder",
        folder: true,
        userId: session.user.id,
        parentId,
        path:
          data.parent && data.parent !== "/"
            ? `${data.parent}/${data.name}`
            : `/${data.name}`,
      },
    });

    return json(file);
  } catch (e) {
    return error("Invalid body", 400);
  }
};
