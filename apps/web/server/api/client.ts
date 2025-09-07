import { db } from "@mockj/db";
import { Context } from "@mockj/trpc";
import { headers } from "next/headers";
import requestIp from "request-ip";

export async function createContextFromRequest(req: Request) {
  const ip = requestIp.getClientIp({
    headers: Object.fromEntries(req.headers.entries()),
  });
  return createContext(db, ip);
}

export const createContext = async (
  database?: typeof db,
  ip?: string | null
): Promise<Context> => {
  if (ip === undefined) {
    const hdrs = await headers();
    ip = requestIp.getClientIp({
      headers: Object.fromEntries(hdrs.entries()),
    });
  }
  return {
    db: database ?? db,
    req: {
      ip,
    },
  };
};
