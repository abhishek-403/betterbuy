import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { HOST_AMAZON, HOST_FLIPKART, HOST_INVALID, HOST_NA } from "./type";

export function formatDateTime(date: Date) {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  return date.toLocaleString("en-IN", options);
}

export function formatPrice(number: number): string {
  const numberString = number.toFixed(2); 

  const parts = numberString.split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1];

  const integerParts = [];
  for (let i = integerPart.length; i > 0; i -= 3) {
    integerParts.unshift(integerPart.substring(Math.max(0, i - 3), i));
  }

  return integerParts.join(",") + (decimalPart ? "." + decimalPart : "");
}

export async function getUser() {
  const session = await getServerSession(NEXT_AUTH_CONFIG);
  return session;
}



export function getHost(url:string):string {
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
};