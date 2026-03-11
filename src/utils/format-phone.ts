export function formatWhatsApp(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 0) return "";

  if (cleaned === "0") {
    cleaned = "62";
  } else if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }

  return "+" + cleaned;
}

export function ensure62(phone: string): string {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  } else if (cleaned.length > 0 && !cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }
  return cleaned;
}
