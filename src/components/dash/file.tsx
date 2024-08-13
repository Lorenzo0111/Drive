import { File as FileType } from "@prisma/client";
import axios from "axios";
import Link from "next/link";
import { RenameDialog } from "../dialogs/RenameDialog";
import { Button } from "../ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { TableCell, TableRow } from "../ui/table";
import { useToast } from "../ui/use-toast";

export function File({
  file,
  refetch,
}: {
  file: FileType;
  refetch: () => void;
}) {
  const { toast } = useToast();

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
          <TableCell className="text-right">
            {file.public ? "Public" : "Private"}
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              axios
                .patch(`/api/files/${file.id}`, {
                  public: true,
                })
                .then(() => refetch());

              navigator.clipboard.writeText(
                `${window.location.origin}/${file.id}`,
              );

              toast({
                description: "Link copied to clipboard",
              });
            }}
            className="w-full"
            variant="ghost"
          >
            Share
          </Button>
        </ContextMenuItem>
        {file.public && (
          <ContextMenuItem asChild>
            <Button
              onClick={() => {
                axios
                  .patch(`/api/files/${file.id}`, {
                    public: false,
                  })
                  .then(() => refetch());
              }}
              className="w-full"
              variant="ghost"
            >
              Make private
            </Button>
          </ContextMenuItem>
        )}
        <ContextMenuItem asChild>
          <RenameDialog id={file.id} name={file.name} refetch={refetch} />
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              axios.delete(`/api/files/${file.id}`).then(() => refetch());
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
