//@ts-nocheck
import { ProductDetailsProp } from "@/components/utils/type";
import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

type ResponseData = {
  message: string;
};

export const HOSTS: { [key: string]: string } = {
  Flipkart: "flipkart",
  Amazon: "amazon",
  Invalid: "invalid",
  NA: "na",
};

async function POST(req: Request, res: Response) {
  try {
    let { url } = await req.json();

    const host = getHost(url);

    let prodDetails;
    if (host === HOSTS.Amazon) {
      prodDetails = await getAmazon(url);
    } else if (host === HOSTS.flipkart) {
      prodDetails = await getFlipkart(url);
    } else if (host === HOSTS.NA) {
      prodDetails = { message: "Service form this host not available" };
    } else if (host === HOSTS.Invalid) {
      prodDetails = { message: "Invalid url" };
    }
    return NextResponse.json(
      { response: prodDetails },
      {
        status: 200,
      }
    );
  } catch (e) {
    return NextResponse.json(
      { response: e },
      {
        status: 200,
      }
    );
  }
}

async function getAmazon(url: string) {
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
      const name = document.querySelector("#productTitle")?.textContent;

      const currency = document.querySelector(".a-price-symbol")?.textContent;
      const price = document.querySelector(".a-price-whole")?.textContent;
      const fraction = document.querySelector(".a-price-fraction")?.textContent;

      const images = document.querySelectorAll("#landingImage");

      const img = Array.from(images).map((img) => img.src);

      let tempprice = `${price}.${fraction}`;
      if (price?.includes(".")) {
        tempprice = `${price}${fraction}`;
      }

      return { name, price: tempprice, currency, img: img[0] };
    } catch (error) {
      console.log(error);
    }
  });

  await browser.close();

  const strr = item!.price.replace(/,/g, "");
  let price = parseFloat(strr);

  let itemFinal = {
    name: item?.name,
    image: item?.img,
    price,
    currency: item?.currency,
    provider: HOSTS.Amazon,
  };

  return itemFinal;
}

async function getFlipkart(url: string) {
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

      const name = itemDiv.querySelector(".VU-ZEz")?.textContent;

      const str = itemDiv.querySelector(".Nx9bqj.CxhGGd")?.textContent;

      const images = document.querySelectorAll(".DByuf4.IZexXJ.jLEJ7H");

      const img = Array.from(images).map((img) => img.src);

      return { name, str, img: img[0] };
    } catch (error) {
      console.log(error);
    }
  });

  await browser.close();
  let str = item?.str;
  let currency;
  if (str!.charAt(0) === "$" || str!.charAt(0) === "₹") {
    currency = str!.charAt(0);
  }
  const strr = str!.slice(1).replace(/,/g, "");
  const price = parseFloat(strr);
  let itemFinal = {
    provider: HOSTS.Flipkart,
    name: item?.name,
    image: item?.img,
    price,
    currency,
  };

  return itemFinal;
}

export function getHost(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname.includes("amazon")) {
      return HOSTS.Amazon;
    } else if (hostname.includes("flipkart")) {
      return HOSTS.flipkart;
    } else {
      return HOSTS.NA;
    }
  } catch (error) {
    return HOSTS.Invalid;
  }
}

export { POST };
