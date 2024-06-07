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
async function POST(req: Request, res: Response) {
  try {
    let { url } = await req.json();
    const rest = await getDetails(url);
    return NextResponse.json(
      { response: rest },
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

async function getDetails(url: string) {
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
      const price = itemDiv.querySelector(".Nx9bqj.CxhGGd")?.textContent;
      // @ts-ignore

      const images = document.querySelectorAll(".DByuf4.IZexXJ.jLEJ7H");
      // @ts-ignore
      const img = Array.from(images).map((img) => img.src);

      return { name, price, img: img[0] };
    } catch (error) {
      console.log(error);
    }
  });

  await browser.close();
  return item;
}

export { POST };
