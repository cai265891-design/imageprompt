import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { auth } from "@clerk/nextjs/server";

import { createTRPCContext } from "@saasfly/api";
import { edgeRouter } from "@saasfly/api/edge";

// export const runtime = "edge";
const createContext = async (req: NextRequest) => {
  const session = await auth();
  
  return createTRPCContext({
    headers: req.headers,
    userId: session?.userId,
    isAdmin: false, // 将在后续步骤中实现管理员检查
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
