import { createId } from "@paralleldrive/cuid2";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

function createdAtField() {
  return integer("createdAt", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date());
}

function modifiedAtField() {
  return integer("modifiedAt", { mode: "timestamp" })
    .$defaultFn(() => new Date())
    .$onUpdate(() => new Date());
}

export const jsons = sqliteTable("json", {
  id: text("id")
    .notNull()
    .primaryKey()
    .$defaultFn(() => createId()),
  json: text("json", { length: 3000 }).notNull(),
  createdAt: createdAtField(),
  modifiedAt: modifiedAtField(),
  expires: integer("expires", { mode: "timestamp" }).notNull(),
});
