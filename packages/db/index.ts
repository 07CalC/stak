import { neon } from "@neondatabase/serverless";
import * as schema from "./schema/index"
import { drizzle } from "drizzle-orm/neon-http";
import dotenv from "dotenv"

dotenv.config()

if (!process.env.DB_URI) {
  throw new Error("DB_URI is not set")
}

const sql = neon(process.env.DB_URI!)

export const db = drizzle(sql, {
  schema: schema
})

export { eq } from "drizzle-orm"
