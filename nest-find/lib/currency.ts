// Curated list, not the full ISO 4217 set - kept to currencies actually
// relevant to this platform's market so the picker stays a short dropdown
// instead of a 180-option scroll fest.
export const CURRENCIES = [
    { code: "NGN", label: "Nigerian Naira" },
    { code: "USD", label: "US Dollar" },
    { code: "GBP", label: "British Pound" },
    { code: "EUR", label: "Euro" },
    { code: "GHS", label: "Ghanaian Cedi" },
    { code: "KES", label: "Kenyan Shilling" },
    { code: "ZAR", label: "South African Rand" },
] as const;

export type CurrencyCode = (typeof CURRENCIES)[number]["code"];

// Locale-aware formatting via the browser's own Intl API - correct symbol,
// separators, and placement for any currency, no hardcoded symbols anywhere.
export const formatPrice = (price: number, currency: string) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
    }).format(price);
