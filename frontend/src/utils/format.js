export function formatINR(n) {
  if (n === undefined || n === null) return "—";
  return "₹" + Math.round(n).toLocaleString("en-IN");
}

export function formatNumber(n) {
  if (n === undefined || n === null) return "—";
  return Math.round(n).toLocaleString("en-IN");
}

export function formatTime(iso) {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}
