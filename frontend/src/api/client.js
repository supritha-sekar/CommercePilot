const BASE = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

export const api = {
  getOverview: () => request("/business/overview"),
  runAnalysis: () => request("/agent/analyze", { method: "POST" }),
  getSegmentCustomers: (id) => request(`/segments/${id}/customers`),
  createCampaign: (payload) =>
    request("/campaigns", { method: "POST", body: JSON.stringify(payload) }),
  listCampaigns: () => request("/campaigns"),
  advanceCampaign: (id) => request(`/campaigns/${id}/advance`, { method: "POST" }),
};
