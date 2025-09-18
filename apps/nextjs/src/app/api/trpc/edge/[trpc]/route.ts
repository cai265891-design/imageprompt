import type { NextRequest } from "next/server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { auth } from "@clerk/nextjs/server";

import { createTRPCContext } from "@saasfly/api";
import { edgeRouter } from "@saasfly/api/edge";

// 禁用静态优化，避免构建时需要数据库连接
export const dynamic = "force-dynamic";
// export const runtime = "edge";
const createContext = async (req: NextRequest) => {
  const session = await auth();
  
  return createTRPCContext({
    headers: req.headers,
    userId: session?.userId,
    isAdmin: false, // 将在后续步骤中实现管理员检查
  });
};

const handler = async (req: NextRequest) => {
  try {
    return await fetchRequestHandler({
      endpoint: "/api/trpc/edge",
      router: edgeRouter,
      req: req,
      createContext: () => createContext(req),
      onError: ({ error, path }) => {
        console.error(`❌ Error in tRPC handler (edge) on path ${path}:`, error);
        
        // Log additional context for debugging
        if (error instanceof Error) {
          console.error(`Error name: ${error.name}`);
          console.error(`Error message: ${error.message}`);
          console.error(`Error stack: ${error.stack}`);
        }
      },
    });
  } catch (error) {
    console.error("🚨 Critical error in tRPC edge handler:", error);
    
    // Return proper error response
    return new Response(
      JSON.stringify({
        error: {
          message: "Internal server error",
          code: "INTERNAL_SERVER_ERROR",
        },
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};

export { handler as GET, handler as POST };
