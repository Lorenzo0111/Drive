import { authenticated, error, json, parseBody } from "@/lib/backend";
import { prisma } from "@/lib/prisma";
import { download, remove } from "@/lib/storage";
import { NextResponse } from "next/server";
import { z } from "zod";

export const GET = authenticated(async (req, { params }) => {
  if (!params?.id || typeof params.id !== "string")
    return error("Invalid file id", 400);

  const file = await prisma.file.findUnique({
    where: {
      id: params.id,
      userId: req.auth.user.id,
    },
    select: {
      name: true,
      path: true,
      type: true,
      size: true,
    },
  });

  if (!file) return error("File not found", 404);

  const buffer = await download(file.path);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": file.type,
      "Content-Length": file.size.toString(),
      "Content-Disposition": `attachment; filename="${file.name}"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
});

export const DELETE = authenticated(async (req, { params }) => {
  if (!params?.id || typeof params.id !== "string")
    return error("Invalid file id", 400);

  const file = await prisma.file.delete({
    where: {
      id: params.id,
      userId: req.auth.user.id,
    },
    select: {
      path: true,
    },
  });

  if (!file) return error("File not found", 404);

  await remove(file.path);

  return json({ message: "File deleted" });
});

const renameSchema = z
  .object({
    name: z.string().min(1).max(255),
  })
  .transform((data) => ({
    name: data.name.trim().replaceAll("/", "_").replaceAll(" ", "_"),
  }));
export const PATCH = authenticated(async (req, { params }) => {
  if (!params?.id || typeof params.id !== "string")
    return error("Invalid file id", 400);

  try {
    const data = await parseBody(req, renameSchema);
    const file = await prisma.file.update({
      where: {
        id: params.id,
        userId: req.auth.user.id,
      },
      data: {
        name: data.name,
      },
    });

    return json(file);
  } catch (e) {
    return error("Invalid body", 400);
  }
});
