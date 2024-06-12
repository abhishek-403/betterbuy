import { formatDateTime, formatPrice, getHost } from "@/components/utils/auxifunctions";
import { generateEmail } from "@/components/utils/mailer";
import { errorres, successres } from "@/components/utils/responseWrapper";
import { HOST_AMAZON, HOST_FLIPKART } from "@/components/utils/type";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

async function handler() {
  try {
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

async function getPrice(url: string): Promise<number> {
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
  const price = parseFloat(strr);

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
  const str = item?.str;

  const strr = str!.slice(1).replace(/,/g, "");
  const price = parseFloat(strr);

  return price;
}

export { handler as POST };

