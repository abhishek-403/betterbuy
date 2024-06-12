import { errorres, successres } from "@/components/utils/responseWrapper";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";

async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

async function handler() {
  const session = await getUser();

  if (!session) {
    return NextResponse.json(errorres(401, "Invalid"));
  }

  const email = session.user?.email;

  if (!email) {
    return NextResponse.json(errorres(401, "Not email"));
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        products: true,
      },
    });

    if (!user) {
      return NextResponse.json(errorres(404, "No user"));
    }

    return NextResponse.json(successres(200, user.products));
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server Error"));
  }
}
export { handler as GET };

