"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useQueryState(key: string, defaultValue: string | null = null) {
  const searchParams = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const [value, setValue] = useState<string | null>(
    searchParams.get(key) || defaultValue,
  );

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value || "");
    if (!value) params.delete(key);

    router.push(path + "?" + params.toString());
  }, [key, path, router, searchParams, value]);

  return [value, setValue] as const;
}
