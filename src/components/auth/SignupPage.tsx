"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {};

export default function SignupPage({}: Props) {
  return (
    <div className="flex w-full justify-center mt-[100px]">
      <div className=" flex flex-col items-center gap-4 border-2 p-2  ">
        <div>Signup</div>

        <div className="flex flex-col gap-4 w-[350px]">
          <div className="p-2 text-lg bg-black border-2  text-center items-center justify-center rounded-full">
            <button onClick={() => signIn("google")}>Google</button>
          </div>
          <div className="p-2 text-lg bg-black border-2  text-center items-center justify-center rounded-full">
            <button onClick={() => signIn("github")}>Github</button>
          </div>
        </div>
      </div>
    </div>
  );
}
