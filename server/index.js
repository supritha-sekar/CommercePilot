import "dotenv/config";
import express from "express";
import cors from "cors";
import { merchant, revenue, segments, opportunities, campaigns } from "./data.js";
import { createPlan } from "./agent.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (_, res) => res.json({ ok: true, service: "CommercePilot" }));

app.get("/api/dashboard", (_, res) => {
  res.json({ merchant, revenue, segments, opportunities, campaigns });
});

app.get("/api/opportunities", (_, res) => res.json(opportunities));

app.post("/api/agent/plan", async (req, res) => {
  try {
    const result = await createPlan(req.body.id);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post("/api/campaigns/execute", (req, res) => {
  const { opportunityId, plan } = req.body;
  const opportunity = opportunities.find(x => x.id === opportunityId);
  if (!opportunity) return res.status(404).json({ error: "Opportunity not found" });

  const campaign = {
    id: `camp-${Date.now()}`,
    opportunityId,
    name: plan?.title || opportunity.title,
    audience: plan?.audience || opportunity.audience,
    status: "SIMULATED_EXECUTED",
    createdAt: new Date().toISOString(),
    estimatedReach: opportunity.audience === "30–60 day inactive" ? 1240 : 2140,
    estimatedRevenue: opportunity.audience === "30–60 day inactive" ? 2290000 : 940000
  };

  campaigns.unshift(campaign);
  res.json({
    success: true,
    message: "Campaign execution simulated successfully.",
    campaign
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`CommercePilot API running on http://localhost:${process.env.PORT || 5000}`);
});
