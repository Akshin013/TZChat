export function normalizePhone(raw: string): string {
  return raw.replace(/\D/g, ""); // только цифры
}

export function toChatId(phone: string): string {
  return `${normalizePhone(phone)}@c.us`;
}

export function phonesMatch(a: string, b: string) {
  const na = normalizePhone(a).slice(-9);
  const nb = normalizePhone(b).slice(-9);
  return na === nb;
}