import { readFile, unlink, writeFile } from "fs/promises";

export const upload = async (file: File, userId: string) => {
  const path = `uploads/${userId}/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await writeFile(path, buffer);

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

export const remove = async (path: string) => {
  await unlink(path);
};
