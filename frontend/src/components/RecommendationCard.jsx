import { formatINR, formatNumber } from "../utils/format.js";

export default function RecommendationCard({ analysis, onCreateCampaign, creating, alreadyCreated }) {
  if (!analysis) return null;
  const { segment, recommendation } = analysis;

  return (
    <div className="border border-line rounded p-5 bg-surface">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium bg-amber-soft text-amber px-2 py-0.5 rounded">
          Opportunity found
        </span>
      </div>
      <h3 className="text-[15px] font-semibold text-ink mb-1">{segment.label}</h3>
      <p className="text-sm text-muted mb-4">
        {formatNumber(segment.size)} customers · avg {formatINR(segment.avgOrderValue)} order value
      </p>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div>
          <p className="text-xs text-muted mb-1">Incentive</p>
          <p className="font-mono text-sm tabular">{formatINR(recommendation.incentiveAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Est. reactivations</p>
          <p className="font-mono text-sm tabular">{formatNumber(recommendation.projectedReactivations)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Est. revenue recovered</p>
          <p className="font-mono text-sm tabular">{formatINR(recommendation.projectedRevenue)}</p>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onCreateCampaign}
          disabled={creating || alreadyCreated}
          className="px-3.5 py-2 rounded bg-accent text-white text-sm font-medium hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {alreadyCreated ? "Campaign created" : creating ? "Creating campaign…" : "Create campaign"}
        </button>
        <button className="px-3.5 py-2 rounded border border-line text-sm text-muted hover:text-ink hover:border-ink/30 transition-colors">
          Adjust incentive
        </button>
      </div>
    </div>
  );
}
