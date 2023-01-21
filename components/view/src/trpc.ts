import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { createTRPCReact } from "@trpc/react-query";
import type { AppRouter } from "server";

function getBaseUrl() {
  if (typeof window !== "undefined")
    // browser should use relative path
    return "";

  if (process.env.VERCEL_URL)
    // reference for vercel.com
    return `https://${process.env.VERCEL_URL}`;

  if (process.env.RENDER_INTERNAL_HOSTNAME)
    // reference for render.com
    return `http://${process.env.RENDER_INTERNAL_HOSTNAME}:${process.env.PORT}`;

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config() {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
        }),
      ],
      /**
       * @link https://tanstack.com/query/v4/docs/reference/QueryClient
       * */
      // queryClientConfig: { defaultOptions: { queries: { staleTime: 60 } } },
    };
  },
  /**
   * @link https://trpc.io/docs/ssr
   * */
  ssr: false,
});

export const trpcReact = createTRPCReact<AppRouter>({});

export const trpcReactClient = trpcReact.createClient({
  links: [
    httpBatchLink({
      url: `http://localhost:3000/api/trpc`,
      fetch(url, options) {
        return fetch(url, options);
      },
    }),
  ],
});