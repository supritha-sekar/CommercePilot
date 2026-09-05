import { formatTime } from "../utils/format.js";

export default function ReasoningStream({ trail, visibleCount, running }) {
  return (
    <div className="flex flex-col gap-4">
      {trail.slice(0, visibleCount).map((item, i) => (
        <div key={item.step} className="trail-item pb-1 rise-in">
          <p className="font-mono text-xs text-faint mb-0.5">{formatTime(item.timestamp)}</p>
          <p className="text-sm text-ink leading-relaxed">{item.text}</p>
        </div>
      ))}
      {running && (
        <div className="trail-item pb-1">
          <p className="font-mono text-xs text-faint mb-0.5">·&nbsp;·&nbsp;·</p>
          <p className="text-sm text-muted italic">thinking…</p>
        </div>
      )}
    </div>
  );
}
