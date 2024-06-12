import { getUser } from "@/components/utils/auxifunctions";
import { errorres, successres } from "@/components/utils/responseWrapper";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";



async function handler() {
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
export { handler as GET };

