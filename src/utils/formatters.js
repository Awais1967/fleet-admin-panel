export function formatDate(input) {
  if (!input) return "-";
  try {
    const d = new Date(input);
    return d.toLocaleDateString();
  } catch {
    return String(input);
  }
}

export function formatTime(input) {
  if (!input) return "-";
  return String(input);
}

export function formatMoney(amount, currency = "USD") {
  const n = Number(amount || 0);
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(n);
  } catch {
    return `${currency} ${n.toFixed(2)}`;
  }
}
