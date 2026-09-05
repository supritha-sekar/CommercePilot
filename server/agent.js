import OpenAI from "openai";
import { opportunities } from "./data.js";

function localPlan(opportunity) {
  const channel = opportunity.audience === "Cart abandoners" ? "email + WhatsApp" : "email";
  const incentive = opportunity.audience === "30–60 day inactive" ? "₹150" : "10%";
  return {
    title: opportunity.title,
    objective: `Improve revenue by targeting ${opportunity.audience.toLowerCase()}.`,
    reasoning: opportunity.recommendation,
    audience: opportunity.audience,
    channel,
    incentive,
    steps: [
      "Validate audience eligibility",
      "Generate personalized message variants",
      "Create campaign with frequency limits",
      "Run a small test cohort",
      "Measure conversion and incremental revenue"
    ],
    guardrails: [
      "Do not contact customers outside the selected segment",
      "Respect campaign frequency limits",
      "Require merchant approval before execution"
    ]
  };
}

export async function createPlan(id) {
  const opportunity = opportunities.find(x => x.id === id);
  if (!opportunity) throw new Error("Opportunity not found");

  if (!process.env.OPENAI_API_KEY) {
    return { mode: "local", plan: localPlan(opportunity) };
  }

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `You are CommercePilot, an AI merchant growth agent.
Create a safe, concise campaign execution plan for this opportunity.
Return valid JSON with keys: title, objective, reasoning, audience, channel, incentive, steps (array), guardrails (array).
Require merchant approval before execution. Never claim a real campaign was sent.

Opportunity:
${JSON.stringify(opportunity)}`;

  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: "You are a merchant growth planning agent." },
      { role: "user", content: prompt }
    ]
  });

  return {
    mode: "openai",
    plan: JSON.parse(response.choices[0].message.content)
  };
}
