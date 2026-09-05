const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "segments", label: "Segments" },
  { key: "campaigns", label: "Campaigns" },
];

export default function Sidebar({ active, onChange }) {
  return (
    <aside className="hidden md:flex w-52 shrink-0 flex-col border-r border-line py-6 px-4">
      <div className="flex items-center gap-2 px-1 mb-8">
        <div className="w-6 h-6 rounded-sm bg-accent" aria-hidden="true" />
        <span className="font-semibold tracking-tight text-[15px]">CommercePilot</span>
      </div>
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`text-left px-3 py-2 rounded text-sm transition-colors ${
              active === item.key
                ? "bg-accent-soft text-accent-dark font-medium"
                : "text-muted hover:bg-surface hover:text-ink"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto px-3 py-3 border-t border-line">
        <p className="text-xs text-faint leading-relaxed">
          Agentic Commerce Track
          <br />
          Razorpay Buildathon
        </p>
      </div>
    </aside>
  );
}
