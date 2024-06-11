import { NEXT_AUTH_CONFIG } from "@/lib/auth";
import { getServerSession } from "next-auth";

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