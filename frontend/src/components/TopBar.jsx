export default function TopBar({ merchantName }) {
  return (
    <header className="flex items-center justify-between border-b border-line px-6 py-4">
      <div>
        <h1 className="text-[15px] font-semibold text-ink">{merchantName || "Loading merchant…"}</h1>
        <p className="text-xs text-muted">D2C home & lifestyle goods</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-surface border border-line flex items-center justify-center text-xs font-medium text-muted">
          NL
        </div>
      </div>
    </header>
  );
}
