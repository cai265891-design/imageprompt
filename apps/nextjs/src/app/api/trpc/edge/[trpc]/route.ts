import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { getToken } from "next-auth/jwt";

import { createTRPCContext } from "@saasfly/api";
import { edgeRouter } from "@saasfly/api/edge";

// export const runtime = "edge";
const createContext = async (req: NextRequest) => {
  const token = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  return createTRPCContext({
    headers: req.headers,
    userId: token?.sub,
    isAdmin: token?.isAdmin as boolean,
  });
};

const handler = (req: NextRequest) =>
  fetchRequestHandler({
    endpoint: "/api/trpc/edge",
    router: edgeRouter,
    req: req,
    createContext: () => createContext(req),
    onError: ({ error, path }) => {
      console.log("Error in tRPC handler (edge) on path", path);
      console.error(error);
    },
  });

export { handler as GET, handler as POST };
