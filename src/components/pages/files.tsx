"use client";

import type { File as FileType } from "@prisma/client";
import axios from "axios";
import { useRef, useState } from "react";
import { File } from "../dash/file";
import { NewFolderDialog } from "../dialogs/NewFolderDialog";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { useFetcher } from "../utils/fetcher";
import { useQueryState } from "../utils/query-state";

export function Files() {
  const [parent, setParent] = useQueryState("parent");
  const { data: files, mutate } = useFetcher<FileType[]>("/api/files");
  const input = useRef<HTMLInputElement>(null);

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
      <div className="flex w-full justify-between border-b p-4">
        <NewFolderDialog refetch={mutate} parent={parent} />
        <Button variant="secondary" onClick={() => input.current?.click()}>
          Upload
        </Button>
      </div>

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

      <input
        hidden
        type="file"
        ref={input}
        onChange={() => {
          if (input.current?.files) {
            const file = input.current.files[0];
            const formData = new FormData();
            formData.append("file", file);

            axios.postForm("/api/files", formData).then(() => mutate());
          }
        }}
      />
    </div>
  );
}
