// Deterministic mock data generator.
// Uses a small seeded PRNG so the "business" looks the same on every server
// restart (stable numbers for demos) while still feeling like real data.

function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260905);

function randInt(min, max) {
  return Math.floor(rand() * (max - min + 1)) + min;
}

function pick(arr) {
  return arr[Math.floor(rand() * arr.length)];
}

const FIRST_NAMES = [
  "Aarav", "Diya", "Kabir", "Ishita", "Rohan", "Meera", "Vikram", "Ananya",
  "Rahul", "Sneha", "Arjun", "Priya", "Karthik", "Nisha", "Aditya", "Pooja",
  "Sanjay", "Divya", "Manish", "Ritu", "Farhan", "Lavanya", "Suresh", "Kavya",
];
const LAST_NAMES = [
  "Sharma", "Iyer", "Reddy", "Menon", "Kapoor", "Nair", "Rao", "Gupta",
  "Pillai", "Chatterjee", "Verma", "Bose", "Naidu", "Joshi", "Mishra", "Desai",
];

const PRODUCT_CATEGORIES = [
  "Skincare", "Fitness Gear", "Home Decor", "Electronics Accessories",
  "Snacks & Beverages", "Apparel", "Books & Stationery", "Pet Supplies",
];

const CITY_TIER = ["Tier 1", "Tier 2", "Tier 3"];

const CHANNELS = ["Instagram Ads", "Google Search", "Organic", "Referral", "WhatsApp"];

const TOTAL_CUSTOMERS = 6400;
const TODAY = new Date("2026-09-05T00:00:00Z");

function daysAgo(n) {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - n);
  return d;
}

/**
 * Each customer gets a purchase history. Roughly 20% of customers are made
 * to fall into a 30-60 day dormancy window with a healthy purchase history,
 * so the agent's "repeat purchase drop-off" finding is grounded in the data
 * rather than a hardcoded line.
 */
function buildCustomers() {
  const customers = [];
  for (let i = 0; i < TOTAL_CUSTOMERS; i++) {
    const id = `CUST-${(10000 + i).toString()}`;
    const name = `${pick(FIRST_NAMES)} ${pick(LAST_NAMES)}`;
    const category = pick(PRODUCT_CATEGORIES);
    const tier = pick(CITY_TIER);
    const channel = pick(CHANNELS);
    const lifetimeOrders = randInt(1, 14);
    const avgOrderValue = randInt(350, 3200);

    // Bucket assignment shapes the dataset:
    // ~19% dormant-but-valuable (30-60 days since last order, 2+ past orders)
    // ~46% active (last order within 30 days)
    // ~35% long-churned (60+ days) or one-time buyers
    const bucketRoll = rand();
    let lastOrderDaysAgo;
    if (bucketRoll < 0.19 && lifetimeOrders >= 2) {
      lastOrderDaysAgo = randInt(30, 60);
    } else if (bucketRoll < 0.65) {
      lastOrderDaysAgo = randInt(0, 29);
    } else {
      lastOrderDaysAgo = randInt(61, 220);
    }

    customers.push({
      id,
      name,
      category,
      cityTier: tier,
      acquisitionChannel: channel,
      lifetimeOrders,
      avgOrderValue,
      lifetimeValue: lifetimeOrders * avgOrderValue,
      lastOrderDate: daysAgo(lastOrderDaysAgo).toISOString().slice(0, 10),
      lastOrderDaysAgo,
    });
  }
  return customers;
}

const customers = buildCustomers();

// Rolling 12-week repeat purchase rate, engineered so week-over-week shows
// a genuine ~18% relative drop in the most recent 4 weeks (this is what the
// agent will "discover" rather than assert).
function buildRepeatPurchaseSeries() {
  const weeks = [];
  let rate = 34.2;
  for (let w = 11; w >= 0; w--) {
    if (w <= 3) {
      rate -= randInt(150, 260) / 100; // accelerating decline recently
    } else {
      rate += (rand() - 0.5) * 0.6; // noisy but flat further back
    }
    weeks.push({
      weekStarting: daysAgo(w * 7 + 6).toISOString().slice(0, 10),
      repeatPurchaseRate: Math.round(rate * 10) / 10,
    });
  }
  return weeks;
}

const repeatPurchaseSeries = buildRepeatPurchaseSeries();

const merchant = {
  name: "Northreef Living",
  businessType: "D2C home & lifestyle goods",
  monthlyRevenue: 4820000, // in paise-free INR for readability
  monthlyOrders: 9130,
  activeCustomers: customers.filter((c) => c.lastOrderDaysAgo <= 30).length,
};

function getDormantValuableSegment() {
  return customers.filter(
    (c) => c.lastOrderDaysAgo >= 30 && c.lastOrderDaysAgo <= 60 && c.lifetimeOrders >= 2
  );
}

export { customers, repeatPurchaseSeries, merchant, getDormantValuableSegment };
