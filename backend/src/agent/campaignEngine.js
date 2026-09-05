import { nanoid } from "nanoid";
import { getSegmentCustomers } from "./analyzeEngine.js";

// In-memory store — fine for a demo/hackathon build. Swap for a real DB
// (e.g. Postgres) before production use.
const campaigns = new Map();

const STAGES = ["created", "sending", "in_progress", "completed"];

export function createCampaign({ segmentId, segmentLabel, segmentSize, incentiveAmount, avgOrderValue, projectedRedemptionRate }) {
  const id = `CAMP-${nanoid(6).toUpperCase()}`;
  const campaign = {
    id,
    segmentId,
    segmentLabel,
    segmentSize,
    incentiveAmount,
    avgOrderValue,
    projectedRedemptionRate,
    status: "created",
    stageIndex: 0,
    createdAt: new Date().toISOString(),
    sent: 0,
    redeemed: 0,
    revenueRecovered: 0,
    sampleRecipients: getSegmentCustomers(segmentId, { limit: 6 }).map((c) => ({
      id: c.id,
      name: c.name,
      lastOrderDaysAgo: c.lastOrderDaysAgo,
      avgOrderValue: c.avgOrderValue,
    })),
  };
  campaigns.set(id, campaign);
  return campaign;
}

export function listCampaigns() {
  return Array.from(campaigns.values()).sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export function getCampaign(id) {
  return campaigns.get(id) || null;
}

/**
 * Advances a campaign one stage and fills in plausible, deterministic-ish
 * execution numbers so the "results are tracked" part of the demo has
 * something real to show without needing a live payments/messaging integration.
 */
export function advanceCampaign(id) {
  const campaign = campaigns.get(id);
  if (!campaign) return null;

  const nextIndex = Math.min(campaign.stageIndex + 1, STAGES.length - 1);
  campaign.stageIndex = nextIndex;
  campaign.status = STAGES[nextIndex];

  if (campaign.status === "sending") {
    campaign.sent = campaign.segmentSize;
  } else if (campaign.status === "in_progress") {
    campaign.redeemed = Math.round(campaign.segmentSize * campaign.projectedRedemptionRate * 0.55);
    campaign.revenueRecovered = campaign.redeemed * campaign.avgOrderValue;
  } else if (campaign.status === "completed") {
    campaign.redeemed = Math.round(campaign.segmentSize * campaign.projectedRedemptionRate);
    campaign.revenueRecovered = campaign.redeemed * campaign.avgOrderValue;
  }

  return campaign;
}
