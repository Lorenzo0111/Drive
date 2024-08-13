import { mkdir, readFile, unlink, writeFile } from "fs/promises";

export const upload = async (file: File, userId: string) => {
  const array = await file.arrayBuffer();

  const path = `uploads/${userId}/${Date.now()}.${file.name}`;
  const buffer = Buffer.from(array);

  await mkdir(`uploads/${userId}`, { recursive: true });
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
