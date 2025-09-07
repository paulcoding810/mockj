import { jsons } from "@mockj/db/schema";
import {
  zJsonSchema,
  zNewJsonRequestSchema,
  zUpdateJsonsRequestSchema,
} from "@mockj/shared/types/jsons";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { Context, publicProcedure, router } from "..";

async function getJson(ctx: Context, jsonId: string) {
  const json = await ctx.db.query.jsons.findFirst({
    where: and(eq(jsons.id, jsonId)),
  });
  if (!json) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: "Json not found",
    });
  }

  return json;
}

export const jsonsAppRouter = router({
  createJson: publicProcedure
    .input(zNewJsonRequestSchema)
    .output(zJsonSchema)
    .mutation(async ({ input, ctx }) => {
      const json = ctx.db.transaction(() => {
        const json = ctx.db
          .insert(jsons)
          .values({
            json: input.json,
            expires: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // Default to 60 days
          })
          .returning()
          .get();
        return json;
      });

      return json;
    }),

  updateJson: publicProcedure
    .input(zUpdateJsonsRequestSchema)
    .output(zJsonSchema)
    .mutation(async ({ input, ctx }) => {
      await ctx.db.transaction(async (tx) => {
        if (input.json) {
          const commonUpdateData: Partial<{
            json: string;
            expires: Date;
            createdAt: Date;
            modifiedAt: Date;
          }> = {
            modifiedAt: new Date(),
            json: input.json,
          };

          if (input.expires) {
            commonUpdateData.expires = input.expires;
          }

          await tx
            .update(jsons)
            .set(commonUpdateData)
            .where(and(eq(jsons.id, input.jsonId)));
        }
      });

      const updatedJson = await getJson(ctx, input.jsonId);
      return updatedJson;
    }),

  getJson: publicProcedure
    .input(z.object({ jsonId: z.string() }))
    .output(zJsonSchema)
    .query(async ({ input, ctx }) => {
      return await getJson(ctx, input.jsonId);
    }),
});
