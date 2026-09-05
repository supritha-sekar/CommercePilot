import { formatINR, formatNumber } from "../utils/format.js";

function Metric({ label, value, sub }) {
  return (
    <div className="flex-1 min-w-[140px] border border-line rounded p-4">
      <p className="text-xs text-muted mb-1.5">{label}</p>
      <p className="font-mono text-xl tabular text-ink">{value}</p>
      {sub && <p className="text-xs text-faint mt-1">{sub}</p>}
    </div>
  );
}

export default function MetricCards({ overview, analysis }) {
  if (!overview) return null;
  const { merchant, totalCustomers } = overview;
  const dropText = analysis
    ? `down ${analysis.finding.relativeDropPct}% vs. prior period`
    : "run analysis to check trend";

  return (
    <div className="flex flex-wrap gap-3">
      <Metric label="Monthly revenue" value={formatINR(merchant.monthlyRevenue)} sub="last 30 days" />
      <Metric label="Monthly orders" value={formatNumber(merchant.monthlyOrders)} sub="last 30 days" />
      <Metric label="Active customers" value={formatNumber(merchant.activeCustomers)} sub={`of ${formatNumber(totalCustomers)} total`} />
      <Metric
        label="Repeat purchase rate"
        value={analysis ? `${analysis.finding.recentAvg}%` : "—"}
        sub={dropText}
      />
    </div>
  );
}
