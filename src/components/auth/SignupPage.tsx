"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import googleLogo from "../assets/googlelogo.png";
import Image from "next/image";
import { Button } from "../ui/button";
type Props = {};

export default function SignupPage({}: Props) {
  return (
    <div className="flex w-full justify-center mt-[100px] ">
      <div className=" flex flex-col items-center gap-10  border-2 rounded p-4  ">
        <div className="font-bold text-3xl">Signup</div>

        <div className="flex flex-col gap-4 w-[300px] md:w-[350px]">
          <Button
            variant={"outline"}
            className=" flex gap-2 text-lg text-center items-center justify-center py-2 h-auto rounded-full"
            onClick={() => signIn("google")}
          >
            <div>
              <Image width={25} height={25} src={googleLogo} alt="" />
            </div>
            <div>Google</div>
          </Button>
          {/* <div className="p-2 text-lg bg-black border-2  text-center items-center justify-center rounded-full">
            <button onClick={() => signIn("github")}>Github</button>
          </div> */}
        </div>
      </div>
    </div>
  );
}
