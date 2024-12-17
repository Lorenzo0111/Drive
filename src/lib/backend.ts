import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const json = (data: any, status: number = 200) =>
  NextResponse.json(data, { status });

export const error = (message: string, status: number = 500) =>
  json({ error: message }, status);

export const parseBody = async <T>(
  req: NextRequest,
  schema: z.ZodType<T>,
): Promise<T> => {
  const body = await req.json();
  const data = schema.safeParse(body);

  if (!data.success) throw new Error(`Invalid request: ${data.error.message}`);

  return data.data;
};
