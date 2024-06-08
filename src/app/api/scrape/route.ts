import { NextResponse } from "next/server";
import puppeteer from "puppeteer";
// export const config = {
//   api: {
//     bodyParser: true,
//   },
// };

type ResponseData = {
  message: string;
};
export enum HOSTNAME {
  FLIPKART,
  AMAZON,
  INVALID,
  NA,
}
async function POST(req: Request, res: Response) {
  try {
    let { url } = await req.json();
    console.log("url", url);

    const host: HOSTNAME = getHost(url);
    let prodDetails;
    if (host === HOSTNAME.AMAZON) {
      prodDetails = await getAmazon(url);
    } else if (host === HOSTNAME.FLIPKART) {
      prodDetails = await getFlipkart(url);
    } else if (host === HOSTNAME.NA) {
      prodDetails = { message: "Service form this host not available" };
    } else if (host === HOSTNAME.INVALID) {
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
      const itemDiv = document.querySelector("#centerCol");

      //@ts-ignore
      const name = document.querySelector("#productTitle")?.textContent;

      // @ts-ignore

      const str = document.querySelector(
        ".a-price.aok-align-center.reinventPricePriceToPayMargin.priceToPay"
      )?.textContent;

      // @ts-ignore

      const images = document.querySelectorAll("#landingImage");
      // @ts-ignore
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
  let itemFinal = { name: item?.name, image: item?.img, price, currency };

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

      //@ts-ignore
      const name = itemDiv.querySelector(".VU-ZEz")?.textContent;

      // @ts-ignore
      const str = itemDiv.querySelector(".Nx9bqj.CxhGGd")?.textContent;
      // @ts-ignore

      const images = document.querySelectorAll(".DByuf4.IZexXJ.jLEJ7H");
      // @ts-ignore
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
  let itemFinal = { name: item?.name, image: item?.img, price, currency };

  return itemFinal;
}

function getHost(url: string) {
  try {
    const parsedUrl = new URL(url);
    const hostname = parsedUrl.hostname;

    if (hostname.includes("amazon")) {
      return HOSTNAME.AMAZON;
    } else if (hostname.includes("flipkart")) {
      return HOSTNAME.FLIPKART;
    } else {
      return HOSTNAME.NA;
    }
  } catch (error) {
    return HOSTNAME.INVALID;
  }
}

export { POST };
