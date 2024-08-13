import { writeFileSync } from "fs";

export const upload = async (file: File, userId: string) => {
  const path = `uploads/${userId}/${file.name}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  writeFileSync(path, buffer);

  return {
    name: file.name,
    size: file.size,
    type: file.type,
    path,
  };
};
