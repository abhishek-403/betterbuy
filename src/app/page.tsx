import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Appbar } from "@/components/AppBar";
import Hero from "@/components/hero/Hero";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  if (!session?.user) {
    redirect("/signin");
  }
  return (
    <div className="flex flex-col p-4 gap-4 w-full">
      <Hero />
    </div>
  );
}
