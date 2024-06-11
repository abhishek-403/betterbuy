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


async function GET(req: any, res: NextApiResponse) {
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
    const products = await prisma.product.findMany({
      where:{
        ownerId :{
          not:email
        }
      },
      take:10
    });

    

    return NextResponse.json(
      { response: products },
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
