import { File as FileType } from "@prisma/client";
import { TableCell, TableRow } from "../ui/table";
import Link from "next/link";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { Button } from "../ui/button";
import axios from "axios";

export function File({
  file,
  refetch,
}: {
  file: FileType;
  refetch: () => void;
}) {
  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow key={file.id}>
          <TableCell>
            <Link href={`/api/files/${file.id}`}>{file.name}</Link>
          </TableCell>
          <TableCell className="text-right">
            {Math.round(file.size / 1000)} KB
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              axios.delete(`/api/files/${file.id}`).then(() => {
                refetch();
              });
            }}
            className="w-full"
            variant="destructive"
          >
            Delete
          </Button>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
