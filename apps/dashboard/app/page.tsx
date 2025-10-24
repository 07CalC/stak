import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { redirect } from "next/navigation";


export default async function Home() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  return (
    <>
      <Navbar />
    </>
  );
}
