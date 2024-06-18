import { errorres, successres } from "@/components/utils/responseWrapper";
import {
  HOST_AMAZON,
  HOST_FLIPKART,
  HOST_INVALID,
  HOST_NA,
} from "@/components/utils/type";
import axios from "axios";
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

async function handler(req: Request, res: Response) {
  try {
    const { url } = await req.json();
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
    const { data } = await axios.get(`${url}`);
    const $ = cheerio.load(data);
    const name = $("#productTitle").text().trim();

    const currency = $(".a-price-symbol").text().trim()[0];
    let price2 = $(".a-price-whole").text().trim();
    const fraction =
      $(".a-price-fraction").text()[0] + $(".a-price-fraction").text()[1] ||
      "00";

    let img;
    $("#landingImage").each((i, ele) => {
      img = $(ele).attr("src");
    });

    price2 = price2.replace(/,/g, "");
    let price = parseInt(price2) + (parseInt(fraction) % 100) / 100;
    
    const itemFinal = {
      name: name,
      image: img,
      price,
      currency: currency,
      provider: HOST_AMAZON,
    };

    return itemFinal;
  } catch (e) {
    // await browser.close();
  }
}

async function getFlipkart(url: string) {
  try {
    const { data } = await axios.get(`${url}`);
    const $ = cheerio.load(data);

    const name = $(".VU-ZEz").text().trim();
    const str = $(".Nx9bqj.CxhGGd").text().trim();
    let img;
    $(".DByuf4.IZexXJ.jLEJ7H").each((i, ele) => {
      img = $(ele).attr("src");
    });
    let currency;
    if (str!.charAt(0) === "$" || str!.charAt(0) === "₹") {
      currency = str!.charAt(0);
    }
    const strr = str!.slice(1).replace(/,/g, "");
    const price = parseFloat(strr);
    const itemFinal = {
      provider: HOST_FLIPKART,
      name: name,
      image: img,
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
