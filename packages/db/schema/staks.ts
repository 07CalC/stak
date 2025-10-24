import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";




export const staks = pgTable("stak", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updatedAt", { mode: "date" }).defaultNow(),
})
