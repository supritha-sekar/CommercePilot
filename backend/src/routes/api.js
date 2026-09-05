import { Router } from "express";
import { merchant, customers } from "../data/mockData.js";
import { runAnalysis, getSegmentCustomers } from "../agent/analyzeEngine.js";
import { createCampaign, listCampaigns, getCampaign, advanceCampaign } from "../agent/campaignEngine.js";

const router = Router();

router.get("/business/overview", (req, res) => {
  res.json({
    merchant,
    totalCustomers: customers.length,
  });
});

router.post("/agent/analyze", (req, res) => {
  const analysis = runAnalysis();
  res.json(analysis);
});

router.get("/segments/:id/customers", (req, res) => {
  const list = getSegmentCustomers(req.params.id, { limit: 25 });
  res.json({ segmentId: req.params.id, count: list.length, customers: list });
});

router.post("/campaigns", (req, res) => {
  const { segmentId, segmentLabel, segmentSize, incentiveAmount, avgOrderValue, projectedRedemptionRate } = req.body;
  if (!segmentId || !segmentSize || !incentiveAmount) {
    return res.status(400).json({ error: "Missing required campaign fields." });
  }
  const campaign = createCampaign({
    segmentId,
    segmentLabel,
    segmentSize,
    incentiveAmount,
    avgOrderValue,
    projectedRedemptionRate,
  });
  res.status(201).json(campaign);
});

router.get("/campaigns", (req, res) => {
  res.json(listCampaigns());
});

router.get("/campaigns/:id", (req, res) => {
  const campaign = getCampaign(req.params.id);
  if (!campaign) return res.status(404).json({ error: "Campaign not found." });
  res.json(campaign);
});

router.post("/campaigns/:id/advance", (req, res) => {
  const campaign = advanceCampaign(req.params.id);
  if (!campaign) return res.status(404).json({ error: "Campaign not found." });
  res.json(campaign);
});

export default router;
