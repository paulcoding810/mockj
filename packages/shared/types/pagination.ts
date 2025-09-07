import { z } from "zod";

export const zCursor = z.object({
  createdAt: z.date(),
  id: z.string(),
});

export type ZCursor = z.infer<typeof zCursor>;
