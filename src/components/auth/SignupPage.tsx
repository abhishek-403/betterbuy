"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function SignupPage({}: Props) {
  const router = useRouter();
  return (
    <div>
      Signup
      <div>
        <input placeholder="email" />
        <input placeholder="password" />
        <button
          onClick={async () => {
            let res = await signIn("credentials", {
              username: "emailddd",
              password: "password.current",
              redirect: false,
            });
            if (!res?.error) {
              router.push("/");
            }
          }}
        >
          submit
        </button>
      </div>
      <div>
        <button onClick={() => signIn("google")}>Google</button>
        <button onClick={() => signIn("github")}>github</button>
      </div>
    </div>
  );
}
