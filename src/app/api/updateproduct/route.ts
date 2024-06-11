import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import puppeteer from "puppeteer";
import { HOSTS, getHost } from "../scrape/route";
import { formatDateTime, formatPrice } from "@/components/utils/auxifunctions";
import { generateEmail } from "@/components/utils/mailer";

async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const products = await prisma.product.findMany({ take: 3 });

    if (!products) {
      return NextResponse.json(
        { response: "no product" },
        {
          status: 200,
        }
      );
    }
    for (const product of products) {
      //fetching new prices
      const prevprice = product.price;
      const newprice = await getPrice(product.url);
      // const receiverEmail = product.ownerId;

      if (!newprice) return NextResponse.json("erro");

      //updating products table

      if (newprice >= product.alltimehighprice) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            price: newprice,
            alltimehighprice: newprice,
          },
        });
      } else if (newprice <= product.alltimelowprice) {
        await prisma.product.update({
          where: {
            id: product.id,
          },
          data: {
            price: newprice,
            alltimelowprice: newprice,
          },
        });

        // send email

        const formatted = formatPrice(newprice);

        generateEmail({
          receiverEmail:"",
          img: product.image,
          link: product.url,
          title: product.name,
          price: `${product.currency}${formatted}`,
        });
      }

      //creating new checkpoint

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
    }

    return NextResponse.json(
      { response: "updated" },
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

async function getPrice(url: string): Promise<number> {
  try {
    const host = getHost(url);

    let prodDetails;
    if (host === HOSTS.Amazon) {
      prodDetails = await getAmazon(url);
    } else if (host === HOSTS.flipkart) {
      prodDetails = await getFlipkart(url);
    }
    if (!prodDetails) return 0;
    return prodDetails;
  } catch (e) {
    console.log(e);

    return 0;
  }
}

async function getAmazon(url: string): Promise<number> {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const item = await page.evaluate(() => {
    try {
      const price = document.querySelector(".a-price-whole")?.textContent;
      const fraction = document.querySelector(".a-price-fraction")?.textContent;

      let tempprice = `${price}.${fraction}`;
      if (price?.includes(".")) {
        tempprice = `${price}${fraction}`;
      }

      return { price: tempprice };
    } catch (error) {
      console.log(error);
    }
  });

  await browser.close();

  const strr = item!.price.replace(/,/g, "");
  let price = parseFloat(strr);

  return price;
}
async function getFlipkart(url: string): Promise<number> {
  const browser = await puppeteer.launch({
    headless: true,
    defaultViewport: null,
  });

  const page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "domcontentloaded",
  });
  const item = await page.evaluate(() => {
    try {
      const itemDiv = document.querySelector(".C7fEHH");

      const str = itemDiv!.querySelector(".Nx9bqj.CxhGGd")?.textContent;

      return { str };
    } catch (error) {
      console.log(error);
    }
  });

  await browser.close();
  let str = item?.str;

  const strr = str!.slice(1).replace(/,/g, "");
  const price = parseFloat(strr);

  return price;
}

export { GET };
