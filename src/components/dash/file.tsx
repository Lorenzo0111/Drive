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
import { FileIcon, FolderIcon } from "lucide-react";

export function File({
  id,
  name,
  size,
  public: isPublic,
  folder,
  refetch,
  setParent,
}: {
  id: string;
  name: string;
  size: number;
  public: boolean;
  folder?: boolean;
  refetch: () => void;
  setParent?: () => void;
}) {
  const { toast } = useToast();

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <TableRow key={id}>
          <TableCell className="w-[20px]">
            {folder ? <FolderIcon size={20} /> : <FileIcon size={20} />}
          </TableCell>
          <TableCell>
            <Link
              href={`/api/files/${id}`}
              onClick={(e) => {
                if (!folder) return;

                e.preventDefault();

                setParent?.();
              }}
            >
              {name}
            </Link>
          </TableCell>
          <TableCell className="text-right">
            {Math.round(size / 1000)} KB
          </TableCell>
          <TableCell className="text-right">
            {isPublic ? "Public" : "Private"}
          </TableCell>
        </TableRow>
      </ContextMenuTrigger>

      <ContextMenuContent>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              axios
                .patch(`/api/files/${id}`, {
                  public: true,
                })
                .then(() => refetch());

              navigator.clipboard.writeText(`${window.location.origin}/${id}`);

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
        {isPublic && (
          <ContextMenuItem asChild>
            <Button
              onClick={() => {
                axios
                  .patch(`/api/files/${id}`, {
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
          <RenameDialog id={id} name={name} refetch={refetch} />
        </ContextMenuItem>
        <ContextMenuItem asChild>
          <Button
            onClick={() => {
              axios.delete(`/api/files/${id}`).then(() => refetch());
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
