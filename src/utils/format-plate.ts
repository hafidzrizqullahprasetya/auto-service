export function formatPlateNumber(input: string): string {
  if (!input) return "";
  const raw = input.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();
  const prefixMatch = raw.match(/^[A-Z]{1,2}/);
  if (!prefixMatch) return raw;
  
  const prefix = prefixMatch[0];
  const remainingAfterPrefix = raw.slice(prefix.length);
  const digitMatch = remainingAfterPrefix.match(/^[0-9]{1,4}/);
  if (!digitMatch) {
    return prefix + (remainingAfterPrefix ? " " + remainingAfterPrefix : "");
  }
  
  const digits = digitMatch[0];
  const suffix = remainingAfterPrefix.slice(digits.length).slice(0, 3);
  
  let result = prefix + " " + digits;
  if (suffix) {
    result += " " + suffix;
  }
  
  return result;
}
