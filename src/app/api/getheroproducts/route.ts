import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import prisma from "@/lib/prisma";
import { getUser } from "@/components/utils/auxifunctions";



async function GET() {
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

    if (!email) {
      return NextResponse.json(
        { response: "not found" },
        {
          status: 200,
        }
      );
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { products: true },
    });

    if (!user) {
      console.log("User not found.");
      return NextResponse.json(
        { response: "not found" },
        {
          status: 200,
        }
      );
    }

    // Get all products owned by other users
    const productsOwnedByOthers = await prisma.product.findMany({
      where: {
        NOT: {
          owner: { some: { email } },
        },
      },
      take: 10,
    });

    return NextResponse.json(
      { response: productsOwnedByOthers },
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
