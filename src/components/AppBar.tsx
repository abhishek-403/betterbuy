"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import { ToggleTheme } from "./toggle-theme";
export const Appbar = () => {
  const session = useSession();
  const router = useRouter();
  return (
    <div>
      {session.status === "loading" ? (
        <div>Loading...</div>
      ) : session.status === "unauthenticated" ? (
        <div>
          <button onClick={() => router.push("/signin")}>Signup</button>
        </div>
      ) : (
        <button onClick={() => signOut()}>Sign out</button>
      )}
      <div>
        <ToggleTheme />
      </div>
    </div>
  );
};
