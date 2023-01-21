import * as trpcNext from "@trpc/server/adapters/next";
import { appRouter } from "server/dist/server";

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => ({}),
});
