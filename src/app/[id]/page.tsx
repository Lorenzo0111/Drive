"use client";

import { ButtonLink } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useFetcher } from "@/components/utils/fetcher";
import type { File as FileType } from "@prisma/client";
import { notFound } from "next/navigation";

export default function FilePage({ params }: { params: { id: string } }) {
  const { data: file, isLoading } = useFetcher<FileType>(
    `/api/files/${params.id}/info`,
  );

  if (isLoading) return null;
  if (!file) return notFound();

  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Card>
        <CardHeader>
          <CardTitle>{file.name}</CardTitle>
          <CardDescription>{Math.round(file.size / 1000)} KB</CardDescription>
        </CardHeader>
        <CardContent>
          <ButtonLink className="w-full" href={`/api/files/${params.id}`}>
            Download
          </ButtonLink>
        </CardContent>
      </Card>
    </main>
  );
}
