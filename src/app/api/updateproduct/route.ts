import { formatDateTime, formatPrice } from "@/components/utils/auxifunctions";
import { generateEmail } from "@/components/utils/mailer";
import { errorres, successres } from "@/components/utils/responseWrapper";
import {
  HOST_AMAZON,
  HOST_FLIPKART,
  HOST_INVALID,
  HOST_NA,
} from "@/components/utils/type";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";

async function handler(req: any, res: Response) {
  try {
    const { key, email } = await req.json();
    if (!key || !email) {
      return NextResponse.json(errorres(401, "Invalid Request"));
    }

    if (
      key !== process.env.UPDATE_PRODUCT_KEY ||
      email !== process.env.ADMIN_EMAIL
    ) {
      return NextResponse.json(errorres(401, "Invalid Parameters"));
    }
    const products = await prisma.product.findMany({ take: 4 });

    if (!products) {
      return NextResponse.json(errorres(401, "No product"));
    }

    for (const product of products) {
      //fetching new prices
      const newprice = await getPrice(product.url);

      if (!newprice) return NextResponse.json(errorres(401, "No new prices"));

      //updating products table

      if (newprice > product.alltimehighprice) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            price: newprice,
            alltimehighprice: newprice,
          },
        });
        await prisma.pricecheckpoints.create({
          data: {
            //@ts-ignore
            price: newprice,
            currency: product.currency,
            date: formatDateTime(new Date()),
            product: {
              connect: { id: product.id },
            },
          },
        });
      } else if (newprice < product.alltimelowprice) {
        const products = await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            price: newprice,
            alltimelowprice: newprice,
          },
          include: {
            owner: true,
          },
        });

        await prisma.pricecheckpoints.create({
          data: {
            //@ts-ignore
            price: newprice,
            currency: product.currency,
            date: formatDateTime(new Date()),
            product: {
              connect: { id: product.id },
            },
          },
        });
        // send email

        const owners = products.owner;

        for (const owner of owners) {
          const formatted = formatPrice(newprice);
          generateEmail({
            receiverEmail: owner.email,
            img: product.image,
            link: product.url,
            title: product.name,
            price: `${product.currency}${formatted}`,
          });
        }
      }
    }

    return NextResponse.json(successres(200, "Updated Product"));
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server Error"));
  }
}

async function getPrice(url: string) {
  try {
    const host = getHost(url);

    let prodDetails;
    if (host === HOST_AMAZON) {
      prodDetails = await getAmazon(url);
    } else if (host === HOST_FLIPKART) {
      prodDetails = await getFlipkart(url);
    }
    if (!prodDetails) return 0;
    return prodDetails;
  } catch (e) {
    console.log(e);

    return 0;
  }
}

async function getAmazon(url: string) {
  try {
    const { data } = await axios.get(`${url}`);
    const $ = cheerio.load(data);
    let price2 = $(".a-price-whole").text().trim();
    const fraction =
      $(".a-price-fraction").text()[0] + $(".a-price-fraction").text()[1] ||
      "00";

    price2 = price2.replace(/,/g, "");
    let price = parseInt(price2) + (parseInt(fraction) % 100) / 100;

    return price;
  } catch (e) {}
}
async function getFlipkart(url: string) {
  try {
    const { data } = await axios.get(`${url}`);
    const $ = cheerio.load(data);
    const str = $(".Nx9bqj.CxhGGd").text().trim();

    const strr = str!.slice(1).replace(/,/g, "");
    const price = parseFloat(strr);

    return price;
  } catch (e) {}
}

function getHost(url: string): string {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname.includes("amazon")) {
      return HOST_AMAZON;
    } else if (hostname.includes("flipkart")) {
      return HOST_FLIPKART;
    } else {
      return HOST_NA;
    }
  } catch (error) {
    return HOST_INVALID;
  }
}

export { handler as POST };
