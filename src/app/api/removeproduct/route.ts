import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import prisma from "@/lib/prisma";
import { getUser } from "@/components/utils/auxifunctions";

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

    const product = await prisma.product.findUnique({
      where: { id },
      include: { owner: true, pricedata: true },
    });

    if (!product) {
      return NextResponse.json({ response: "not owner" }, { status: 200 });
    }

    // Check if the user is the owner of the product
    const isOwner = product.owner.some((user) => user.email === email);

    if (!isOwner) {
      return NextResponse.json({ response: "not owner" }, { status: 200 });
    }

    if (product.owner.length === 1) {
      await prisma.pricecheckpoints.deleteMany({
        where: {
          productId: id,
        },
      });

      // Now, delete the product
      await prisma.product.delete({
        where: {
          id,
        },
      });

     
    } else {
      await prisma.user.update({
        where: { email },
        data: {
          products: {
            disconnect: { id: id },
          },
        },
      });

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
