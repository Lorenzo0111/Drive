import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import archiver from "archiver";

export const upload = async (file: File, userId: string) => {
  const array = await file.arrayBuffer();

  const path = `${process.env.STORAGE_PATH}/${userId}/${Date.now()}.${file.name}`;
  const buffer = Buffer.from(array);

  await mkdir(`${process.env.STORAGE_PATH}/${userId}`, { recursive: true });
  await writeFile(path, new Uint8Array(buffer));

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    path,
  };
};

export const download = async (path: string) => {
  const buffer = await readFile(path);
  return buffer;
};

export const downloadFolder = async (
  files: {
    name: string;
    path: string;
  }[],
) => {
  const archive = archiver("zip", {
    zlib: { level: 9 },
  });

  for (const file of files) {
    archive.file(file.path, { name: file.name });
  }

  archive.finalize();

  return archive;
};

export const remove = async (path: string) => {
  await unlink(path);
};
