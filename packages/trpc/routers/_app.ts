import { router } from "..";
import { jsonsAppRouter } from "./jsons";

export const appRouter = router({
  jsons: jsonsAppRouter,
});

export type AppRouter = typeof appRouter;
