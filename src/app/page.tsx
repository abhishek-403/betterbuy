import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { Appbar } from "@/components/AppBar";
import Hero from '@/components/hero/Hero'
async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

export default async function Home() {
  const session = await getUser();

  return (
    <div className="flex flex-col p-4 gap-4">
      <Appbar />
      {/* Hello world
      {JSON.stringify(session)} */}
      <Hero/>
    </div>
  );
}
