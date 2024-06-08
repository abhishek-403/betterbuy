"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
export const Appbar = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-10">
      <div>
        <p className="text-2xl font-bold">BetterBuy</p>
      </div>
      <div className="flex items-center">
        <Signup />
        {/* <ToggleTheme /> */}
        <div>
          <Button onClick={() => router.push("/myproducts")}>
            Products
          </Button>
        </div>
      </div>
    </div>
  );
};
function Signup() {
  const router = useRouter();

  const session = useSession();
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
    </div>
  );
}
