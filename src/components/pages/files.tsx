"use client";

import { DndContext } from "@dnd-kit/core";
import type { File as FileType } from "@prisma/client";
import axios from "axios";
import { Fragment, useRef } from "react";
import { FileFolderContainer } from "../dash/file";
import { NewFolderDialog } from "../dialogs/NewFolderDialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
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
  const [parent, setParent] = useQueryState("parent", "/");
  const { data: files, mutate } = useFetcher<FileType[]>(
    `/api/files?parent=${parent}`,
  );
  const input = useRef<HTMLInputElement>(null);

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);
        formData.append("parent", parent || "/");

        axios.postForm("/api/files", formData).then(() => mutate());
      }}
      onDragOver={(e) => e.preventDefault()}
      className="h-screen w-full overflow-auto"
    >
      <div className="flex w-full items-center justify-between border-b p-4">
        <NewFolderDialog refetch={mutate} parent={parent} />

        <Breadcrumb>
          <BreadcrumbList>
            {(!parent || parent === "/" ? [""] : parent.split("/")).map(
              (path, i) => (
                <Fragment key={path}>
                  <BreadcrumbItem>
                    <BreadcrumbLink
                      onClick={() => {
                        if (i === 0) {
                          setParent(null);
                        } else {
                          setParent(
                            parent?.split("/").slice(0, i).join("/") || "/",
                          );
                        }
                      }}
                    >
                      {path || "/"}
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {i < (parent?.split("/").length || 0) - 1 && (
                    <BreadcrumbSeparator />
                  )}
                </Fragment>
              ),
            )}
          </BreadcrumbList>
        </Breadcrumb>

        <Button variant="secondary" onClick={() => input.current?.click()}>
          Upload
        </Button>
      </div>
      <DndContext
        onDragEnd={(e) => {
          if (!e.active || !e.over) return;

          const active = e.active.id;
          const over = e.over.id;

          axios
            .patch(`/api/files/${active}`, { parent: over || null })
            .then(() => {
              mutate();
            });
        }}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Size</TableHead>
              <TableHead className="text-right">Visibility</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {parent && parent !== "/" && (
              <FileFolderContainer
                id={
                  parent === null || parent === "/"
                    ? "/"
                    : parent.split("/").slice(0, -1).join("/")
                }
                name=".."
                size={0}
                public={false}
                folder
                refetch={mutate}
                setParent={() =>
                  setParent(
                    parent === null || parent === "/"
                      ? "/"
                      : parent.split("/").slice(0, -1).join("/"),
                  )
                }
              />
            )}
            {files?.map((file) => (
              <FileFolderContainer
                key={file.id}
                id={file.id}
                name={file.name}
                size={file.size}
                public={file.public}
                folder={file.folder}
                refetch={mutate}
                setParent={() =>
                  setParent(
                    `${!parent || parent === "/" ? "" : parent}/${file.name}`,
                  )
                }
              />
            ))}
          </TableBody>
        </Table>
      </DndContext>

      <input
        hidden
        type="file"
        ref={input}
        onChange={() => {
          if (input.current?.files) {
            const file = input.current.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("parent", parent || "/");

            axios.postForm("/api/files", formData).then(() => mutate());
          }
        }}
      />
    </div>
  );
}
