import { formatDateTime, getUser } from "@/components/utils/auxifunctions";
import { errorres, successres } from "@/components/utils/responseWrapper";
import prisma from "@/lib/prisma";
import axios from "axios";
import { NextResponse } from "next/server";
const NEXT_CLIENT_URL = "http://localhost:3000";

async function POST(req: any, res: Response) {
  try {
    const { name, price, currency, image, url, provider, id } =
      await req.json();

    const session = await getUser();

    if (!session) {
      return NextResponse.json(errorres(401, "Invalid User"));
    }

    const email = session.user?.email;

    if (!email) {
      return NextResponse.json(errorres(404, "Email not found"));
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(errorres(404, "User not found"));
    }

    const existingProd = await prisma.product.findFirst({
      where: {
        id,
      },
    });
    if (existingProd) {
      const res = await axios.post(
        `${NEXT_CLIENT_URL}/api/updateproductowner`,
        { id, userEmail: session?.user.email }
      );
      return NextResponse.json(successres(200, res.data.result));
    }
    const newProduct = await prisma.product.create({
      data: {
        id,
        name,
        price,
        currency,
        image,
        url,
        provider,
        alltimehighprice: price,
        alltimelowprice: price,
        owner: {
          connect: { email },
        },
      },
    });

    const date = formatDateTime(new Date());
    await prisma.pricecheckpoints.create({
      data: {
        price,
        currency,
        date,
        product: {
          connect: { id: newProduct.id },
        },
      },
    });

    return NextResponse.json(successres(200, "Added Product"));
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server Error"));
  }
}
export { POST };

