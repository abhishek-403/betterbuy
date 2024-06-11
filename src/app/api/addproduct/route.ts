import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import { formatDateTime, getUser } from "@/components/utils/auxifunctions";
import prisma from "@/lib/prisma";
import axios from "axios";

const NEXT_CLIENT_URL = "http://localhost:3000";

async function POST(req: any, res: NextApiResponse) {
  try {
    const { name, price, currency, image, url, provider, id } =
      await req.json();

    const session = await getUser();

    if (!session) {
      return NextResponse.json({ response: "Invalid" }, { status: 200 });
    }

    const email = session.user?.email;

    if (!email) {
      return NextResponse.json({ response: "not found" }, { status: 200 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ response: "not found" }, { status: 200 });
    }

    console.log(id);
    const existingProd = await prisma.product.findFirst({
      where: {
        id,
      },
    });
    if (existingProd) {
      console.log("existing", session?.user.email);

      const res = await axios.post(
        `${NEXT_CLIENT_URL}/api/updateproductowner`,
        { id, userEmail: session?.user.email }
      );
      return NextResponse.json(
        {
          response: res.data,
        },
        { status: 200 }
      );
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

    let date = formatDateTime(new Date());
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

    return NextResponse.json({ response: newProduct }, { status: 200 });
  } catch (e) {
    console.log(e);

    return NextResponse.json({ response: e }, { status: 500 });
  }
}
export { POST };
