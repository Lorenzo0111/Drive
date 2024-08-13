"use client";

import type { File as FileType } from "@prisma/client";
import { File } from "../dash/file";
import { useFetcher } from "../fetcher";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import axios from "axios";

export function Files() {
  const { data: files, mutate } = useFetcher<FileType[]>("/api/files");

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        const formData = new FormData();
        formData.append("file", file);

        axios.postForm("/api/files", formData).then(() => mutate());
      }}
      onDragOver={(e) => e.preventDefault()}
      className="h-screen w-full overflow-auto"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead className="text-right">Size</TableHead>
            <TableHead className="text-right">Visibility</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files?.map((file) => (
            <File key={file.id} file={file} refetch={mutate} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
