import { NextApiResponse } from "next";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import prisma from "@/lib/prisma";
import { getUser } from "@/components/utils/auxifunctions";

async function POST(req: Request, res: NextApiResponse) {
  try {
    const { id, userEmail } = await req.json();
    const session = await getUser();


    if (!session && !userEmail) {
      return NextResponse.json(
        { response: "Invalid" },
        {
          status: 200,
        }
      );
    }
    let email;
    if (session) {
      email = session.user?.email;
    } else {
      email = userEmail;
    }

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
    });

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!user || !product) {
      return NextResponse.json(
        { response: "User or product not found." },
        { status: 404 }
      );
    }

    const isAlreadyOwner = await prisma.product.findFirst({
      where: {
        AND: [{ id }, { owner: { some: { email } } }],
      },
    });
    if (isAlreadyOwner) {
      return NextResponse.json({ response: "Already added" }, { status: 200 });
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

    return NextResponse.json(
      { response: "added" },
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
