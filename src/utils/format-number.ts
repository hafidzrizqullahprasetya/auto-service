export function compactFormat(value: number) {
  const formatter = new Intl.NumberFormat("en", {
    notation: "compact",
    compactDisplay: "short",
  });

  return formatter.format(value);
}

export function standardFormat(value: number) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatNumber(value: number | undefined | null) {
  if (value === undefined || value === null) return "0";
  return value.toLocaleString("id-ID");
}

export function stripFormatting(value: string): number {
  return Number(value.replace(/\D/g, "")) || 0;
}

export function formatCurrency(value: number | undefined | null) {
  if (value === undefined || value === null) return "Rp 0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

