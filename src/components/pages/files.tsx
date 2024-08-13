"use client ";

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

export function Files() {
  const { data: files } = useFetcher<FileType[]>("/api/files");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead className="text-right">Size</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {files?.map((file) => <File key={file.id} file={file} />)}
      </TableBody>
    </Table>
  );
}
