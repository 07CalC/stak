import { NextRequest, NextResponse } from "next/server";
import { db, eq } from "@stak/db";
import { users } from "@stak/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json({ available: false, error: "Username is required" }, { status: 400 });
  }

  if (username.length < 3) {
    return NextResponse.json({ available: false, error: "Username must be at least 3 characters" }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return NextResponse.json({ available: false, error: "Username can only contain letters, numbers, and underscores" }, { status: 400 });
  }

  try {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.username, username.toLowerCase()),
    });

    return NextResponse.json({ available: !existingUser });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json({ available: false, error: "Server error" }, { status: 500 });
  }
}
