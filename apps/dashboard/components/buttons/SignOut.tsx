import { signOut } from "next-auth/react"

export const SignOut = () => {
  return (
    <button onClick={() => signOut()} className="p-3 rounded bg-red-500 text-white">
      Sign Out
    </button>
  )
}
