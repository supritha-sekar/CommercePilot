export const merchant = {
  name: "UrbanCart",
  currency: "INR",
  monthlyRevenue: 1842500,
  revenueGrowth: 12.8,
  orders: 4286,
  repeatRate: 31.4,
  conversionRate: 4.8
};

export const revenue = [
  { day: "Mon", revenue: 235000, orders: 510 },
  { day: "Tue", revenue: 262000, orders: 566 },
  { day: "Wed", revenue: 248000, orders: 542 },
  { day: "Thu", revenue: 286000, orders: 634 },
  { day: "Fri", revenue: 318000, orders: 721 },
  { day: "Sat", revenue: 274000, orders: 651 },
  { day: "Sun", revenue: 219500, orders: 662 }
];

export const segments = [
  { name: "High-value repeat", customers: 842, avgOrderValue: 3240, risk: "low" },
  { name: "30–60 day inactive", customers: 1240, avgOrderValue: 1850, risk: "medium" },
  { name: "New customers", customers: 1968, avgOrderValue: 1120, risk: "medium" },
  { name: "Cart abandoners", customers: 2140, avgOrderValue: 1640, risk: "high" }
];

export const opportunities = [
  {
    id: "op-001",
    title: "Win back inactive customers",
    impact: "High",
    score: 91,
    description: "1,240 customers have not purchased in 30–60 days despite historically strong order value.",
    metric: "₹22.9L potential GMV",
    action: "Create a personalized win-back campaign",
    audience: "30–60 day inactive",
    recommendation: "Offer a limited-time ₹150 incentive and personalized product recommendations."
  },
  {
    id: "op-002",
    title: "Recover high-intent carts",
    impact: "High",
    score: 86,
    description: "Cart abandonment is elevated for customers with an average cart value above ₹1,600.",
    metric: "₹9.4L recoverable GMV",
    action: "Launch an abandoned-cart recovery workflow",
    audience: "Cart abandoners",
    recommendation: "Send a reminder with product context and a small time-bound incentive."
  },
  {
    id: "op-003",
    title: "Increase repeat purchases",
    impact: "Medium",
    score: 74,
    description: "Repeat rate is 31.4%, leaving room to move first-time customers into a second purchase.",
    metric: "+4–7% repeat rate",
    action: "Create a second-purchase journey",
    audience: "New customers",
    recommendation: "Trigger a post-purchase recommendation sequence based on product category."
  }
];

export const campaigns = [];
