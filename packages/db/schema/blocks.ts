import { integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { staks } from "./staks";




export const blocks = pgTable("block", {
  id: uuid("id").primaryKey().defaultRandom(),
  stakId: uuid("stakId").notNull().references(() => staks.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  content: jsonb("content").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),

  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
})
