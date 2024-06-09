import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";
import { formatDateTime } from "@/components/constants/utils";

async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

const prisma = new PrismaClient();

async function POST(req: any, res: NextApiResponse) {
  try {
    const { name, price, currency, image, url, provider } = await req.json();

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

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        currency,
        image,
        url,
        provider,
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
