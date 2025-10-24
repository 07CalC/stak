

import { auth } from "@/auth";
import { db, eq } from "@stak/db";
import { users } from "@stak/db/schema";
import { redirect } from "next/navigation";
import UsernameForm from "./UsernameForm";

export default async function Username() {
  const session = await auth();
  if (!session?.user) {
    redirect('/login');
  }

  const userId = session.user.id;
  if (!userId) {
    redirect('/login');
  }

  const userRecord = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      username: true,
    },
  });
  
  if (userRecord?.username) {
    redirect('/');
  }

  return <UsernameForm userId={userId} userEmail={session.user.email} />;
}
