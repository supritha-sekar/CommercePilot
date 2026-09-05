export default function TrendChart({ series }) {
  if (!series || series.length === 0) return null;

  const width = 560;
  const height = 140;
  const padX = 8;
  const padY = 16;
  const values = series.map((p) => p.repeatPurchaseRate);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = series.map((p, i) => {
    const x = padX + (i / (series.length - 1)) * (width - padX * 2);
    const y = height - padY - ((p.repeatPurchaseRate - min) / range) * (height - padY * 2);
    return [x, y];
  });

  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  // Split into "prior" (first 8 weeks) and "recent decline" (last 4 weeks) segments
  const splitIdx = series.length - 4;
  const priorPath = points
    .slice(0, splitIdx + 1)
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");
  const recentPath = points
    .slice(splitIdx)
    .map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`)
    .join(" ");

  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" role="img" aria-label="Repeat purchase rate trend over 12 weeks">
      <path d={priorPath} fill="none" stroke="#D1D5DB" strokeWidth="2" />
      <path d={recentPath} fill="none" stroke="#B4690E" strokeWidth="2" />
      <circle cx={last[0]} cy={last[1]} r="3.5" fill="#B4690E" />
      <line x1={padX} y1={height - padY} x2={width - padX} y2={height - padY} stroke="#F3F4F6" strokeWidth="1" />
    </svg>
  );
}
