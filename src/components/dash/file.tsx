import { File as FileType } from "@prisma/client";
import { TableCell, TableRow } from "../ui/table";

export function File({ file }: { file: FileType }) {
  return (
    <TableRow key={file.id}>
      <TableCell>{file.name}</TableCell>
      <TableCell className="text-right">{file.size}</TableCell>
    </TableRow>
  );
}
