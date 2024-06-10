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
  const numberString = number.toString();

  const parts = [];
  for (let i = numberString.length; i > 0; i -= 3) {
    parts.unshift(numberString.substring(Math.max(0, i - 3), i));
  }

  return parts.join(",");
}
