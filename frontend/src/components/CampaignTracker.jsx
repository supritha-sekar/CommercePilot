import { formatINR, formatNumber } from "../utils/format.js";

const STATUS_LABEL = {
  created: "Created",
  sending: "Sending",
  in_progress: "In progress",
  completed: "Completed",
};

export default function CampaignTracker({ campaign }) {
  if (!campaign) return null;

  return (
    <div className="border border-line rounded p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs text-faint font-mono">{campaign.id}</p>
          <h3 className="text-[15px] font-semibold text-ink">{campaign.segmentLabel}</h3>
        </div>
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded ${
            campaign.status === "completed"
              ? "bg-accent-soft text-accent-dark"
              : "bg-surface text-muted border border-line"
          }`}
        >
          {STATUS_LABEL[campaign.status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <p className="text-xs text-muted mb-1">Sent</p>
          <p className="font-mono text-sm tabular">{formatNumber(campaign.sent)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Redeemed</p>
          <p className="font-mono text-sm tabular">{formatNumber(campaign.redeemed)}</p>
        </div>
        <div>
          <p className="text-xs text-muted mb-1">Revenue recovered</p>
          <p className="font-mono text-sm tabular">{formatINR(campaign.revenueRecovered)}</p>
        </div>
      </div>

      <div className="mt-4 h-1 bg-line rounded overflow-hidden">
        <div
          className="h-full bg-accent transition-all duration-700 ease-out"
          style={{
            width:
              campaign.status === "created"
                ? "5%"
                : campaign.status === "sending"
                ? "35%"
                : campaign.status === "in_progress"
                ? "70%"
                : "100%",
          }}
        />
      </div>
    </div>
  );
}
