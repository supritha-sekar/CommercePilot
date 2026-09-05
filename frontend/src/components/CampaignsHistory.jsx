import { formatINR, formatNumber } from "../utils/format.js";

const STATUS_LABEL = {
  created: "Created",
  sending: "Sending",
  in_progress: "In progress",
  completed: "Completed",
};

export default function CampaignsHistory({ campaigns }) {
  if (!campaigns || campaigns.length === 0) {
    return <p className="text-sm text-muted">No campaigns yet. Approve a recommendation to launch one.</p>;
  }

  return (
    <div className="border border-line rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface text-left text-xs text-muted">
            <th className="font-medium px-3 py-2">Campaign</th>
            <th className="font-medium px-3 py-2">Segment</th>
            <th className="font-medium px-3 py-2">Status</th>
            <th className="font-medium px-3 py-2 text-right">Revenue recovered</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c.id} className="border-b border-line last:border-0">
              <td className="px-3 py-2 font-mono text-xs text-faint">{c.id}</td>
              <td className="px-3 py-2 text-ink">{c.segmentLabel}</td>
              <td className="px-3 py-2 text-muted">{STATUS_LABEL[c.status]}</td>
              <td className="px-3 py-2 text-right font-mono tabular">{formatINR(c.revenueRecovered)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
