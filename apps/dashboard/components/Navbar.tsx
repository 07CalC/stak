'use client'

import { useSession } from "next-auth/react"
import Link from "next/link";
import { SignOut } from "./buttons/SignOut";



export const Navbar = () => {
  const session = useSession();
  const user = session.data?.user

  return (
    <nav className="flex items-center justify-between p-4 bg-white border-b">
      <Link href="/" className="text-2xl font-bold text-gray-800">
        Stak.bio
      </Link>
      <div>
        {user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user.name || user.email}
            </span>
            {user.image && (
              <img
                src={user.image}
                alt="User profile picture"
                className="w-8 h-8 rounded-full"
              />
            )}
            <SignOut />
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}
