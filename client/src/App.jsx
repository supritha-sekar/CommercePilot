import { useEffect, useState } from "react";
import {
  Bot, TrendingUp, Users, ShoppingCart, Sparkles, Play,
  CheckCircle2, ArrowUpRight, ShieldCheck, Zap
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer
} from "recharts";

const money = n => `₹${(n / 100000).toFixed(1)}L`;

export default function App() {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const r = await fetch("/api/dashboard");
    setData(await r.json());
  }

  useEffect(() => { load(); }, []);

  async function generatePlan(opportunity) {
    setSelected(opportunity);
    setPlan(null);
    setMessage("");
    setLoading(true);
    try {
      const r = await fetch("/api/agent/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: opportunity.id })
      });
      const result = await r.json();
      setPlan(result);
    } finally {
      setLoading(false);
    }
  }

  async function execute() {
    if (!selected || !plan) return;
    setExecuting(true);
    const r = await fetch("/api/campaigns/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId: selected.id, plan: plan.plan })
    });
    const result = await r.json();
    setMessage(result.message);
    setExecuting(false);
    load();
  }

  if (!data) return <div className="loading">Loading CommercePilot…</div>;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand"><div className="brandIcon"><Bot size={21}/></div><span>CommercePilot</span></div>
        <div className="nav active"><TrendingUp size={18}/> Growth Agent</div>
        <div className="nav"><Users size={18}/> Customers</div>
        <div className="nav"><ShoppingCart size={18}/> Campaigns</div>
        <div className="nav"><ShieldCheck size={18}/> Guardrails</div>
        <div className="sidebarBottom">
          <div className="aiBadge"><Sparkles size={16}/><span>AI Agent Online</span><i/></div>
          <small>Demo environment • simulated execution</small>
        </div>
      </aside>

      <main className="main">
        <header>
          <div>
            <p className="eyebrow">AI GROWTH & AGENTIC COMMERCE</p>
            <h1>Good evening, {data.merchant.name}</h1>
            <p className="muted">Your AI growth agent found opportunities worth acting on.</p>
          </div>
          <button className="outlineBtn"><Zap size={16}/> Agent status: Ready</button>
        </header>

        <section className="metrics">
          <Metric label="Monthly Revenue" value={money(data.merchant.monthlyRevenue)} trend={`+${data.merchant.revenueGrowth}%`} />
          <Metric label="Orders" value={data.merchant.orders.toLocaleString()} trend="+8.4%" />
          <Metric label="Repeat Rate" value={`${data.merchant.repeatRate}%`} trend="+2.1%" />
          <Metric label="Conversion" value={`${data.merchant.conversionRate}%`} trend="+0.7%" />
        </section>

        <section className="grid2">
          <div className="card chartCard">
            <div className="cardHeader"><div><h2>Revenue momentum</h2><p>Last 7 days</p></div><ArrowUpRight size={19}/></div>
            <div className="chart"><ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenue}>
                <XAxis dataKey="day" axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip formatter={(v) => money(v)}/>
                <Area type="monotone" dataKey="revenue" fillOpacity=".16" strokeWidth={3}/>
              </AreaChart>
            </ResponsiveContainer></div>
          </div>

          <div className="card agentCard">
            <div className="agentTop"><div className="agentOrb"><Bot size={25}/></div><div><h2>Growth Agent</h2><p>Autonomous analysis complete</p></div></div>
            <div className="agentMessage"><Sparkles size={18}/><span>I found <b>{data.opportunities.length} high-value opportunities</b>. The top opportunity could unlock <b>₹22.9L</b> in potential GMV.</span></div>
            <button className="primaryBtn" onClick={() => generatePlan(data.opportunities[0])}><Sparkles size={17}/> Ask agent to act</button>
          </div>
        </section>

        <section>
          <div className="sectionTitle"><div><p className="eyebrow">AGENT DISCOVERY</p><h2>Growth opportunities</h2></div><span className="pill">{data.opportunities.length} detected</span></div>
          <div className="opportunities">
            {data.opportunities.map((o, i) => (
              <div className={`card opportunity ${selected?.id === o.id ? "selected" : ""}`} key={o.id}>
                <div className="opHeader"><span className={`impact ${o.impact.toLowerCase()}`}>{o.impact} impact</span><strong>Score {o.score}</strong></div>
                <h3>{o.title}</h3>
                <p>{o.description}</p>
                <div className="opBottom"><div><small>Potential</small><b>{o.metric}</b></div><button className="textBtn" onClick={() => generatePlan(o)}>Generate plan <ArrowUpRight size={16}/></button></div>
              </div>
            ))}
          </div>
        </section>

        {selected && (
          <section className="card planCard">
            <div className="sectionTitle">
              <div><p className="eyebrow">AGENT PLAN</p><h2>{selected.title}</h2></div>
              {plan && <span className="pill success"><CheckCircle2 size={15}/> Plan ready</span>}
            </div>
            {loading && <div className="thinking"><Sparkles size={18}/> Agent is analyzing the opportunity and creating a safe execution plan…</div>}
            {plan && <div className="planGrid">
              <div><h4>Reasoning</h4><p>{plan.plan.reasoning}</p></div>
              <div><h4>Audience</h4><p>{plan.plan.audience}</p></div>
              <div><h4>Channel</h4><p>{plan.plan.channel}</p></div>
              <div><h4>Incentive</h4><p>{plan.plan.incentive}</p></div>
              <div className="wide"><h4>Agent workflow</h4><ol>{plan.plan.steps.map((s, i) => <li key={i}>{s}</li>)}</ol></div>
              <div className="wide guardrails"><h4><ShieldCheck size={16}/> Guardrails</h4>{plan.plan.guardrails.map((g,i)=><span key={i}>✓ {g}</span>)}</div>
              <div className="wide actionRow"><button className="primaryBtn" disabled={executing} onClick={execute}><Play size={17}/>{executing ? "Executing…" : "Approve & simulate execution"}</button>{message && <span className="successText"><CheckCircle2 size={17}/> {message}</span>}</div>
            </div>}
          </section>
        )}

        {data.campaigns.length > 0 && (
          <section>
            <div className="sectionTitle"><div><p className="eyebrow">EXECUTION LOG</p><h2>Recent agent actions</h2></div></div>
            <div className="card table">
              {data.campaigns.map(c => <div className="row" key={c.id}><span>{c.name}</span><span>{c.audience}</span><span className="status">{c.status}</span><span>{money(c.estimatedRevenue)} est.</span></div>)}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

function Metric({label, value, trend}) {
  return <div className="card metric"><p>{label}</p><h2>{value}</h2><span><ArrowUpRight size={14}/> {trend}</span></div>
}
