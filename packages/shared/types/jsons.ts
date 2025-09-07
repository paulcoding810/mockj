import { z } from "zod";

import { zCursor } from "./pagination";

export const zJsonSchema = z.object({
  id: z.string(),
  json: z.string(),
  createdAt: z.date(),
  modifiedAt: z.date().nullable(),
  expires: z.date(),
});

export type ZJson = z.infer<typeof zJsonSchema>;

export const zUpdateJsonsRequestSchema = z.object({
  jsonId: z.string(),
  json: z.string(),
  expires: z.date().optional(),
});

export const zNewJsonRequestSchema = z.object({
  json: z.string(),
  createdAt: z.date().optional(),
});

export const zGetJsonsRequestSchema = z.object({
  ids: z.array(z.string()).optional(),
  cursor: zCursor.nullish(),
});

export const zGetJsonsResponseSchema = z.object({
  jsons: z.array(zJsonSchema),
  nextCursor: zCursor.nullable(),
});
