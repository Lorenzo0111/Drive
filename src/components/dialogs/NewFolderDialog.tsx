"use client";

import axios from "axios";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

export function NewFolderDialog({
  parent,
  refetch,
}: {
  parent: string | null;
  refetch: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>New folder</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.target as HTMLFormElement);

            axios
              .put(`/api/files`, {
                name: form.get("name") as string,
                parent,
              })
              .then(() => refetch());
          }}
        >
          <Input className="w-full" placeholder="Folder name" name="name" />
          <Button className="w-full" type="submit">
            Create
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
