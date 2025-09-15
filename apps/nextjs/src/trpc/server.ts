import "server-only";

import { auth } from "@clerk/nextjs/server";
import {
  createTRPCProxyClient,
  loggerLink,
  TRPCClientError,
} from "@trpc/client";

import { AppRouter } from "@saasfly/api";

import { transformer } from "./shared";
import { observable } from "@trpc/server/observable";
import { callProcedure } from "@trpc/server";
import { TRPCErrorResponse } from "@trpc/server/rpc";
import { cache } from "react";
import { appRouter } from "../../../../packages/api/src/root";

export const createTRPCContext = async (opts: {
  headers: Headers;
  userId?: string;
  isAdmin?: boolean;
  // eslint-disable-next-line @typescript-eslint/require-await
}) => {
  return {
    userId: opts.userId,
    isAdmin: opts.isAdmin,
    ...opts,
  };
};

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(async () => {
  try {
    const session = await auth();
    const userId = session?.userId;
    const isAdmin = false; // TODO: 从Clerk获取管理员权限

    return createTRPCContext({
      headers: new Headers({
        "x-trpc-source": "rsc",
      }),
      userId: userId,
      isAdmin: isAdmin,
    });
  } catch (error) {
    // 如果认证失败，返回未认证上下文
    return createTRPCContext({
      headers: new Headers({
        "x-trpc-source": "rsc",
      }),
      userId: undefined,
      isAdmin: false,
    });
  }
});

export const trpc = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    /**
     * Custom RSC link that lets us invoke procedures without using http requests. Since Server
     * Components always run on the server, we can just call the procedure as a function.
     */
    () =>
      ({ op }) =>
        observable((observer) => {
          createContext()
            .then((ctx) => {
              return callProcedure({
                procedures: appRouter._def.procedures,
                path: op.path,
                rawInput: op.input,
                ctx,
                type: op.type,
              });
            })
            .then((data) => {
              observer.next({ result: { data } });
              observer.complete();
            })
            .catch((cause: TRPCErrorResponse) => {
              observer.error(TRPCClientError.from(cause));
            });
        }),
  ],
});
export { type RouterInputs, type RouterOutputs } from "@saasfly/api";
