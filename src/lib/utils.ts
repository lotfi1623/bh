export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function formatPrice(price: number, locale: "fr" | "ar" = "fr"): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-DZ" : "fr-DZ", {
    style: "currency",
    currency: "DZD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}
