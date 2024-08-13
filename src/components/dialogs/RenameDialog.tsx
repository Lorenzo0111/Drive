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

export function RenameDialog({
  id,
  name,
  refetch,
}: {
  id: string;
  name: string;
  refetch: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full" variant="ghost">
          Rename
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();

            const form = new FormData(e.target as HTMLFormElement);

            axios
              .patch(`/api/files/${id}`, {
                name: form.get("name") as string,
              })
              .then(() => refetch());
          }}
        >
          <Input
            className="w-full"
            defaultValue={name}
            placeholder="New name"
            name="name"
          />
          <Button className="w-full" type="submit">
            Rename
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
