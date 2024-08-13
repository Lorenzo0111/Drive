import { File as FileType } from "@prisma/client";
import { TableCell, TableRow } from "../ui/table";
import Link from "next/link";

export function File({ file }: { file: FileType }) {
  return (
    <TableRow key={file.id}>
      <TableCell>
        <Link href={`/api/files/${file.id}`}>{file.name}</Link>
      </TableCell>
      <TableCell className="text-right">
        {Math.round(file.size / 1000)} KB
      </TableCell>
    </TableRow>
  );
}
