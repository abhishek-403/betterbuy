import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import prisma from "@/lib/prisma";
import { getUser } from "@/components/utils/auxifunctions";
import { errorres, successres } from "@/components/utils/responseWrapper";



async function GET() {
  try {
    const session = await getUser();

    if (!session) {
      return NextResponse.json(errorres(401,"Invalid"));
    }

    const email = session.user?.email;

    if (!email) {
      return NextResponse.json(errorres(401, "Not email"));
    }
    const user = await prisma.user.findUnique({
      where: { email },
      include: { products: true },
    });

    if (!user) {
      return NextResponse.json(errorres(401, "Not user"));
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

    return NextResponse.json(successres(200,productsOwnedByOthers));
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server Error"));
  }
}
export { GET };
