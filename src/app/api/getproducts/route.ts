import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";

async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

const prisma = new PrismaClient();

async function GET(req: any, res: NextApiResponse) {
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

  if (!email) {
    return NextResponse.json(
      { response: "not found" },
      {
        status: 200,
      }
    );
  }

  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        products: true,
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
      { response: user.products },
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
export { GET };
