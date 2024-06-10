import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import prisma from "@/lib/prisma";

async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}


async function POST(req: any, res: NextApiResponse) {
  try {
    const session = await getUser();

    if (!session) {
      return NextResponse.json(
        { response: "Invalid" },
        {
          status: 200,
        }
      );
    }

    const email = session.user?.email;
    const { id } = await req.json();

    if (!email) {
      return NextResponse.json(
        { response: "not found" },
        {
          status: 200,
        }
      );
    }


    await prisma.pricecheckpoints.deleteMany({
      where: { id },
    });

    const user = await prisma.product.delete({
      where: {
        id,
      },
    });

    if (!user) {
      return NextResponse.json(
        { response: "no user" },
        {
          status: 200,
        }
      );
    }

    return NextResponse.json(
      { response: "Deleted" },
      {
        status: 200,
      }
    );
  } catch (e) {
    console.log(e);

    return NextResponse.json(
      { response: e },
      {
        status: 200,
      }
    );
  }
}
export { POST };
