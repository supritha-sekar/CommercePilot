import {
  customers,
  repeatPurchaseSeries,
  merchant,
  getDormantValuableSegment,
} from "../data/mockData.js";

function round1(n) {
  return Math.round(n * 10) / 10;
}

function currentTimestamp(offsetSeconds = 0) {
  const d = new Date(Date.now() + offsetSeconds * 1000);
  return d.toISOString();
}

/**
 * Runs a deterministic "analysis pass" over the merchant's data and returns:
 *  - a step-by-step reasoning trail (what the agent looked at, in order)
 *  - the finding (the drop in repeat purchase rate, computed from real series data)
 *  - a recommendation grounded in an actual customer segment size
 */
export function runAnalysis() {
  const recent4 = repeatPurchaseSeries.slice(-4);
  const prior4 = repeatPurchaseSeries.slice(-8, -4);
  const recentAvg = recent4.reduce((s, w) => s + w.repeatPurchaseRate, 0) / recent4.length;
  const priorAvg = prior4.reduce((s, w) => s + w.repeatPurchaseRate, 0) / prior4.length;
  const relativeDropPct = round1(((priorAvg - recentAvg) / priorAvg) * 100);

  const segment = getDormantValuableSegment();
  const segmentAvgOrderValue = Math.round(
    segment.reduce((s, c) => s + c.avgOrderValue, 0) / segment.length
  );
  const segmentAvgLifetimeOrders = round1(
    segment.reduce((s, c) => s + c.lifetimeOrders, 0) / segment.length
  );

  // Suggested incentive: scaled off segment's own average order value so the
  // number is grounded in the data, not an arbitrary constant.
  const suggestedIncentive = Math.round((segmentAvgOrderValue * 0.08) / 10) * 10;
  const projectedRedemptionRate = 0.11; // conservative baseline for a win-back nudge
  const projectedReactivations = Math.round(segment.length * projectedRedemptionRate);
  const projectedRevenue = projectedReactivations * segmentAvgOrderValue;

  const trail = [
    {
      step: "scan_metrics",
      timestamp: currentTimestamp(0),
      text: `Pulled 12 weeks of order data for ${merchant.name} across ${customers.length.toLocaleString("en-IN")} customers.`,
    },
    {
      step: "detect_trend",
      timestamp: currentTimestamp(1),
      text: `Repeat purchase rate averaged ${round1(priorAvg)}% over weeks 5-8 and ${round1(recentAvg)}% over the last 4 weeks — a ${relativeDropPct}% relative drop.`,
    },
    {
      step: "segment_customers",
      timestamp: currentTimestamp(2),
      text: `Isolated customers with 2+ past orders whose last purchase was 30-60 days ago. Found ${segment.length.toLocaleString("en-IN")} customers matching, averaging ${segmentAvgLifetimeOrders} lifetime orders and ₹${segmentAvgOrderValue.toLocaleString("en-IN")} average order value.`,
    },
    {
      step: "recommend_action",
      timestamp: currentTimestamp(3),
      text: `Recommending a ₹${suggestedIncentive} personalized incentive to this segment. At an 11% redemption rate (typical for win-back offers to warm customers), this reactivates an estimated ${projectedReactivations.toLocaleString("en-IN")} customers and recovers roughly ₹${projectedRevenue.toLocaleString("en-IN")} in the next 30 days.`,
    },
  ];

  return {
    generatedAt: currentTimestamp(0),
    finding: {
      metric: "repeat_purchase_rate",
      recentAvg: round1(recentAvg),
      priorAvg: round1(priorAvg),
      relativeDropPct,
      series: repeatPurchaseSeries,
    },
    segment: {
      id: "SEG-DORMANT-30-60",
      label: "Lapsing repeat customers (30-60 days)",
      size: segment.length,
      avgOrderValue: segmentAvgOrderValue,
      avgLifetimeOrders: segmentAvgLifetimeOrders,
    },
    recommendation: {
      type: "personalized_incentive",
      incentiveAmount: suggestedIncentive,
      projectedRedemptionRate,
      projectedReactivations,
      projectedRevenue,
    },
    trail,
  };
}

export function getSegmentCustomers(segmentId, { limit = 25 } = {}) {
  if (segmentId !== "SEG-DORMANT-30-60") return [];
  return getDormantValuableSegment()
    .sort((a, b) => b.lifetimeValue - a.lifetimeValue)
    .slice(0, limit);
}
