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

export function formatNumber(value: number) {
  return value.toLocaleString("id-ID");
}

/**
 * Strip all formatting characters from a string and return the numeric value
 * Useful for converting formatted strings like "50.000" back to 50000
 * @param value - The formatted string (e.g., "50.000" atau "1.000.000")
 * @returns The numeric value without formatting
 */
export function stripFormatting(value: string): number {
  return Number(value.replace(/\D/g, "")) || 0;
}
