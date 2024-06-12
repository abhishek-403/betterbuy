import { getUser } from "@/components/utils/auxifunctions";
import { errorres, successres } from "@/components/utils/responseWrapper";
import prisma from "@/lib/prisma";
import { NextApiResponse } from "next";
import { NextResponse } from "next/server";

async function handler(req: any, res: NextApiResponse) {
  try {
    const session = await getUser();

    if (!session) {
      return NextResponse.json(errorres(401, "Invalid"));
    }

    const email = session.user?.email;
    const { id } = await req.json();

    if (!email) {
      return NextResponse.json(errorres(404, "Not found"));
    }

    const product = await prisma.product.findUnique({
      where: { id },
      include: { owner: true, pricedata: true },
    });

    if (!product) {
      return NextResponse.json(errorres(200, "No product"));
    }

    // Check if the user is the owner of the product
    const isOwner = product.owner.some((user) => user.email === email);

    if (!isOwner) {
      return NextResponse.json(errorres(401, "Not the owner"));
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

    return NextResponse.json(successres(200, "Deleted Product"));
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server Error"));
  }
}
export { handler as POST };

