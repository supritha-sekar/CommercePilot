import { useEffect, useRef, useState } from "react";
import Sidebar from "./components/Sidebar.jsx";
import TopBar from "./components/TopBar.jsx";
import MetricCards from "./components/MetricCards.jsx";
import TrendChart from "./components/TrendChart.jsx";
import ReasoningStream from "./components/ReasoningStream.jsx";
import RecommendationCard from "./components/RecommendationCard.jsx";
import SegmentTable from "./components/SegmentTable.jsx";
import CampaignTracker from "./components/CampaignTracker.jsx";
import CampaignsHistory from "./components/CampaignsHistory.jsx";
import { api } from "./api/client.js";

export default function App() {
  const [tab, setTab] = useState("dashboard");
  const [overview, setOverview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [visibleTrailCount, setVisibleTrailCount] = useState(0);
  const [segmentCustomers, setSegmentCustomers] = useState([]);
  const [creatingCampaign, setCreatingCampaign] = useState(false);
  const [activeCampaign, setActiveCampaign] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const revealTimer = useRef(null);
  const advanceTimer = useRef(null);

  useEffect(() => {
    api.getOverview().then(setOverview).catch(() => {});
    api.listCampaigns().then(setCampaigns).catch(() => {});
  }, []);

  useEffect(() => () => {
    clearInterval(revealTimer.current);
    clearInterval(advanceTimer.current);
  }, []);

  async function handleRunAnalysis() {
    setAnalyzing(true);
    setAnalysis(null);
    setVisibleTrailCount(0);
    setActiveCampaign(null);
    try {
      const result = await api.runAnalysis();
      setAnalysis(result);
      const segRes = await api.getSegmentCustomers(result.segment.id);
      setSegmentCustomers(segRes.customers);

      let count = 0;
      revealTimer.current = setInterval(() => {
        count += 1;
        setVisibleTrailCount(count);
        if (count >= result.trail.length) {
          clearInterval(revealTimer.current);
          setAnalyzing(false);
        }
      }, 550);
    } catch (e) {
      setAnalyzing(false);
    }
  }

  async function handleCreateCampaign() {
    if (!analysis) return;
    setCreatingCampaign(true);
    try {
      const campaign = await api.createCampaign({
        segmentId: analysis.segment.id,
        segmentLabel: analysis.segment.label,
        segmentSize: analysis.segment.size,
        incentiveAmount: analysis.recommendation.incentiveAmount,
        avgOrderValue: analysis.segment.avgOrderValue,
        projectedRedemptionRate: analysis.recommendation.projectedRedemptionRate,
      });
      setActiveCampaign(campaign);
      setCampaigns((prev) => [campaign, ...prev]);

      let step = 0;
      advanceTimer.current = setInterval(async () => {
        step += 1;
        const updated = await api.advanceCampaign(campaign.id);
        setActiveCampaign(updated);
        setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        if (step >= 3) clearInterval(advanceTimer.current);
      }, 1400);
    } finally {
      setCreatingCampaign(false);
    }
  }

  const trail = analysis?.trail || [];
  const showThinking = analyzing && visibleTrailCount < trail.length;

  return (
    <div className="min-h-screen flex text-ink font-sans">
      <Sidebar active={tab} onChange={setTab} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar merchantName={overview?.merchant?.name} />

        <main className="flex-1 px-6 py-6 overflow-y-auto">
          {tab === "dashboard" && (
            <div className="flex flex-col gap-6 max-w-5xl">
              <MetricCards overview={overview} analysis={analysis} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left: agent reasoning stream */}
                <section>
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-sm font-semibold text-ink">Agent activity</h2>
                    <button
                      onClick={handleRunAnalysis}
                      disabled={analyzing}
                      className="text-sm font-medium px-3 py-1.5 rounded bg-ink text-white hover:bg-black disabled:opacity-50 transition-colors"
                    >
                      {analyzing ? "Analyzing…" : "Run growth analysis"}
                    </button>
                  </div>

                  {trail.length === 0 && !analyzing && (
                    <p className="text-sm text-muted border border-dashed border-line rounded p-4">
                      No analysis run yet. CommercePilot will scan recent sales and
                      customer data for growth opportunities.
                    </p>
                  )}

                  <ReasoningStream trail={trail} visibleCount={visibleTrailCount} running={showThinking} />

                  {analysis && visibleTrailCount >= trail.length && (
                    <div className="mt-5">
                      <RecommendationCard
                        analysis={analysis}
                        onCreateCampaign={handleCreateCampaign}
                        creating={creatingCampaign}
                        alreadyCreated={!!activeCampaign}
                      />
                    </div>
                  )}
                </section>

                {/* Right: data panel */}
                <section className="flex flex-col gap-6">
                  <div>
                    <h2 className="text-sm font-semibold text-ink mb-3">Repeat purchase rate — 12 weeks</h2>
                    <div className="border border-line rounded p-4">
                      {analysis ? (
                        <TrendChart series={analysis.finding.series} />
                      ) : (
                        <p className="text-sm text-muted">Run analysis to see the trend.</p>
                      )}
                    </div>
                  </div>

                  {activeCampaign && (
                    <div>
                      <h2 className="text-sm font-semibold text-ink mb-3">Campaign execution</h2>
                      <CampaignTracker campaign={activeCampaign} />
                    </div>
                  )}
                </section>
              </div>
            </div>
          )}

          {tab === "segments" && (
            <div className="max-w-3xl flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-ink">Lapsing repeat customers (30–60 days)</h2>
              <p className="text-sm text-muted -mt-2 mb-2">
                Customers with 2+ past orders whose most recent purchase was 30–60 days ago.
                Run an analysis from the dashboard to populate this segment.
              </p>
              <SegmentTable customers={segmentCustomers} />
            </div>
          )}

          {tab === "campaigns" && (
            <div className="max-w-3xl flex flex-col gap-3">
              <h2 className="text-sm font-semibold text-ink">Campaign history</h2>
              <CampaignsHistory campaigns={campaigns} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
