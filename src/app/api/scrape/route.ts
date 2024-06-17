//@ts-nocheck
import { errorres, successres } from "@/components/utils/responseWrapper";
import {
  HOST_AMAZON,
  HOST_FLIPKART,
  HOST_INVALID,
  HOST_NA,
} from "@/components/utils/type";
import { NextResponse } from "next/server";
// import puppeteer from "puppeteer";
import chromium from "@sparticuz/chromium-min";
import { Browser } from "puppeteer";
import { Browser as CoreBrowser } from "puppeteer-core";

async function handler(req: Request, res: Response) {
  try {
    const { url }: string = await req.json();
    const host = getHost(url);

    const parsedUrl = new URLSearchParams(new URL(url).search);

    let prodDetails;
    let productId;

    if (host === HOST_AMAZON) {
      prodDetails = await getAmazon(url);
      const match = url.match(/\/dp\/([A-Z0-9]+)/);
      productId = match ? match[1] : null;
    } else if (host === HOST_FLIPKART) {
      productId = parsedUrl.get("pid");
      prodDetails = await getFlipkart(url);
    } else if (host === HOST_NA) {
      prodDetails = { message: "Service form this host not available" };
    } else if (host === HOST_INVALID) {
      prodDetails = { message: "Invalid url" };
    }

    return NextResponse.json(
      successres(200, { ...prodDetails, id: productId })
    );
  } catch (e) {
    console.log(e);

    return NextResponse.json(errorres(500, "Server Error"));
  }
}

async function getAmazon(url: string) {
  try {
    // const browser = await puppeteer.launch({
    //   headless: true,
    //   defaultViewport: null,
    // });

    let browser: Browser | CoreBrowser;
    if (process.env.NODE_ENV === "production") {
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
      });
    }
    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    const item = await page.evaluate(() => {
      try {
        const name = document.querySelector("#productTitle")?.textContent;

        const currency = document.querySelector(".a-price-symbol")?.textContent;
        const price = document.querySelector(".a-price-whole")?.textContent;
        const fraction =
          document.querySelector(".a-price-fraction")?.textContent;

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
    const price = parseFloat(strr);

    const itemFinal = {
      name: item?.name,
      image: item?.img,
      price,
      currency: item?.currency,
      provider: HOST_AMAZON,
    };

    return itemFinal;
  } catch (e) {
    // await browser.close();
  }
}

async function getFlipkart(url: string) {
  try {
    //  const browser = await puppeteer.launch({
    //    headless: true,
    //    defaultViewport: null,
    //  });
    let browser: Browser | CoreBrowser;
    if (process.env.NODE_ENV === "production") {
      const puppeteer = await import("puppeteer-core");
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
      });
    } else {
      const puppeteer = await import("puppeteer");
      browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
        headless: "new",
      });
    }

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "domcontentloaded",
    });
    const item = await page.evaluate(() => {
      try {
        const itemDiv = document.querySelector(".C7fEHH");

        const name = itemDiv!.querySelector(".VU-ZEz")?.textContent;

        const str = itemDiv!.querySelector(".Nx9bqj.CxhGGd")?.textContent;

        const images = document.querySelectorAll(".DByuf4.IZexXJ.jLEJ7H");

        const img = Array.from(images).map((img) => img.src);

        return { name, str, img: img[0] };
      } catch (error) {
        console.log(error);
      }
    });

    await browser.close();
    const str = item?.str;
    let currency;
    if (str!.charAt(0) === "$" || str!.charAt(0) === "₹") {
      currency = str!.charAt(0);
    }
    const strr = str!.slice(1).replace(/,/g, "");
    const price = parseFloat(strr);
    const itemFinal = {
      provider: HOST_FLIPKART,
      name: item?.name,
      image: item?.img,
      price,
      currency,
    };

    return itemFinal;
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
