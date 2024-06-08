import { NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { NEXT_AUTH_CONFIG } from "../../../lib/auth";

async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}

const prisma = new PrismaClient();

async function POST(req: any, res: NextApiResponse) {
  const { name, amount, image } = await req.json();

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
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    let currency;
    if (amount.charAt(0) === "$" || amount.charAt(0) === "₹") {
      currency = amount.charAt(0);
    }
    const price = parseFloat(amount.slice(1));

    const newProduct = await prisma.product.create({
      data: {
        name,
        price,
        image,
        currency,
        owner:{
          connect:{email}
        }
      },
    });

    // await user.product = newP
    return NextResponse.json(
      { response: newProduct },
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
