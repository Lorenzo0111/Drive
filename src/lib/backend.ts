import { Session } from "next-auth";
import { type NextRequest, NextResponse } from "next/server";
import { auth } from "./auth";
import { z } from "zod";

type NextAuthRequest = NextRequest & {
  auth: Session | null;
};

type NextAuthenticatedRequest = NextRequest & {
  auth: Session;
};

type AppRouteHandlerFnContext = {
  params?: Record<string, string | string[]>;
};

export const authenticated = (
  callback: (
    req: NextAuthenticatedRequest,
    context: AppRouteHandlerFnContext,
  ) => Promise<NextResponse>,
) =>
  auth(async (req: NextAuthRequest, context) => {
    if (!req.auth?.user) return error("Unauthorized", 401);

    return callback(req as NextAuthenticatedRequest, context);
  });

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
