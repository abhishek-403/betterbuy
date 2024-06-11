import { getUser } from "@/components/utils/auxifunctions";
import { errorres, successres } from "@/components/utils/responseWrapper";
import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

async function POST(req: Request, res: NextApiResponse) {
  try {
    const { id, userEmail } = await req.json();
    const session = await getUser();

    if (!session && !userEmail) {
      return NextResponse.json(errorres(401, "Invalid"));
    }
    let email;
    if (session) {
      email = session.user?.email;
    } else {
      email = userEmail;
    }

    if (!email) {
      return NextResponse.json(errorres(401, "No email"));
    }
    const user = await prisma.user.findUnique({
      where: { email },
    });

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!user || !product) {
      return NextResponse.json(errorres(401, "User or product not found"));
    }

    const isAlreadyOwner = await prisma.product.findFirst({
      where: {
        AND: [{ id }, { owner: { some: { email } } }],
      },
    });
    if (isAlreadyOwner) {
      return NextResponse.json(successres(200, "Already added"));
    }

    await prisma.product.update({
      where: { id },
      data: {
        owner: {
          connect: { email },
        },
      },
    });

    await prisma.user.update({
      where: { email },
      data: {
        products: {
          connect: { id },
        },
      },
    });

    return NextResponse.json(successres(200, "Added"));
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server error"));
  }
}
export { POST };

