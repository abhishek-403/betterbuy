"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import Link from "next/link";
import { STAGES } from "./utils/type";
import toast, { Toaster } from "react-hot-toast";
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
export const Appbar = () => {
  const router = useRouter();
  const loadingRef = useRef(null);
  const isloading = useSelector(
    (state: any) => state.appConfigReducer.isLoading
  );
  const toastData = useSelector(
    (state: any) => state.appConfigReducer.toastData
  );
  useEffect(() => {
    handleToast(toastData);
  }, [toastData]);

  useEffect(() => {
    if (isloading) {
      //@ts-ignore
      loadingRef.current?.continuousStart();
    } else {
      //@ts-ignore
      loadingRef.current?.complete();
    }
  }, [isloading]);
  return (
    <div className="relative flex justify-between items-center px-10 border-2 rounded-full py-3">
      <div className="absolute">
        <LoadingBar
          height={4}
          color={
            "linear-gradient(to right, #FFD700, #FF8C00, #FF4500, #8B0000)"
          }
          ref={loadingRef}
        />
        <Toaster />
      </div>
      <div>
        <Link href="/" className="text-2xl font-bold">
          BetterBuy
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* <ToggleTheme /> */}
        <div>
          <Button onClick={() => router.push("/myproducts")}>Products</Button>
        </div>
        <Signup />
      </div>
    </div>
  );
};
function Signup() {
  const router = useRouter();

  const session = useSession();
  return (
    <Button variant={"destructive"}>
      {session.status === "loading" ? (
        <div>Loading...</div>
      ) : session.status === "unauthenticated" ? (
        <div>
          <button onClick={() => router.push("/signin")}>Signup</button>
        </div>
      ) : (
        <button onClick={() => signOut()}>Sign out</button>
      )}
    </Button>
  );
}

export function handleToast(toastData: any) {
  
  switch (toastData.type) {
    case STAGES.LOADING:
      toast.loading(toastData.message);
      break;

    case STAGES.SUCCESS:
      toast.success(toastData.message);
      break;

    case STAGES.FAILURE:
      toast.error(toastData.message);
      break;

    default:
  }
}
