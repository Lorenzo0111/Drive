import { authenticated, error, json, parseBody } from "@/lib/backend";
import { prisma } from "@/lib/prisma";
import { download, downloadFolder, remove } from "@/lib/storage";
import { NextResponse } from "next/server";
import { z } from "zod";

async function prepareFolder(id: string) {
  const filePaths: {
    name: string;
    path: string;
  }[] = [];

  const folder = await prisma.file.findUnique({
    where: {
      id,
    },
    include: {
      childrens: {
        omit: {
          path: false,
        },
      },
    },
    omit: {
      path: false,
    },
  });

  if (!folder) return [];

  for (const file of folder.childrens) {
    if (file.folder) {
      const files = await prepareFolder(file.id);
      filePaths.push(...files);
    }

    filePaths.push({
      name: `${folder.path}/${file.name}`,
      path: file.path,
    });
  }

  return filePaths;
}

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
      folder: true,
    },
  });

  if (!file) return error("File not found", 404);

  if (file.folder) {
    const files = await prepareFolder(params.id);
    const archive = await downloadFolder(files);

    const buffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];

      archive.on("data", (chunk) => {
        chunks.push(chunk);
      });

      archive.on("end", () => {
        resolve(Buffer.concat(chunks));
      });

      archive.on("error", (e) => {
        reject(e);
      });
    });

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Length": buffer.length.toString(),
        "Content-Disposition": `attachment; filename="${file.name}.zip"`,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }

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

async function deleteFolder(id: string) {
  const folder = await prisma.file.findFirst({
    where: {
      id,
    },
    select: {
      path: true,
    },
  });

  if (!folder) return;

  await prisma.file.deleteMany({
    where: {
      path: {
        startsWith: folder.path,
      },
    },
  });
}

export const DELETE = authenticated(async (req, { params }) => {
  if (!params?.id || typeof params.id !== "string")
    return error("Invalid file id", 400);

  const file = await prisma.file.delete({
    where: {
      id: params.id,
      userId: req.auth.user.id,
    },
    select: {
      folder: true,
      path: true,
    },
  });

  if (!file) return error("File not found", 404);

  if (!file.folder) await remove(file.path);
  else await deleteFolder(params.id);

  return json({ message: "File deleted" });
});

const updateSchema = z
  .object({
    name: z.string().min(1).max(255).optional(),
    public: z.boolean().optional(),
    parent: z.string().optional().nullable(),
  })
  .transform((data) => ({
    name: data.name?.trim().replaceAll("/", "_").replaceAll(" ", "_"),
    public: data.public,
    parent: data.parent,
  }));
export const PATCH = authenticated(async (req, { params }) => {
  if (!params?.id || typeof params.id !== "string")
    return error("Invalid file id", 400);

  try {
    const data = await parseBody(req, updateSchema);
    const oldFile = await prisma.file.findUnique({
      where: {
        id: params.id,
        userId: req.auth.user.id,
      },
      select: { folder: true, path: true },
    });

    if (!oldFile) return error("File not found", 404);

    const newFile = await prisma.file.update({
      where: {
        id: params.id,
        userId: req.auth.user.id,
      },
      data: {
        name: data.name,
        public: data.public,
        path:
          data.name && oldFile.folder
            ? oldFile.path.replace(
                oldFile.path.split("/").slice(-1)[0],
                data.name,
              )
            : undefined,
        parent:
          data.parent !== undefined
            ? data.parent === null
              ? { disconnect: true }
              : {
                  connect: {
                    id: data.parent,
                    userId: req.auth.user.id,
                  },
                }
            : undefined,
      },
      select: { folder: true, path: true },
    });

    if (oldFile.folder) {
      const allFiles = await prisma.file.findMany({
        where: {
          path: {
            startsWith: oldFile.path,
          },
        },
        select: {
          id: true,
          path: true,
        },
      });

      const transactions = allFiles.map((f) => {
        return prisma.file.update({
          where: {
            id: f.id,
          },
          data: {
            path: f.path.replace(oldFile.path, newFile.path),
          },
        });
      });

      await prisma.$transaction(transactions);
    }

    return json(newFile);
  } catch (e) {
    return error("Invalid body", 400);
  }
});
