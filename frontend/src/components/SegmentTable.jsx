import { formatINR } from "../utils/format.js";

export default function SegmentTable({ customers }) {
  if (!customers || customers.length === 0) {
    return <p className="text-sm text-muted">Run analysis to surface a segment.</p>;
  }

  return (
    <div className="border border-line rounded overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line bg-surface text-left text-xs text-muted">
            <th className="font-medium px-3 py-2">Customer</th>
            <th className="font-medium px-3 py-2">Last order</th>
            <th className="font-medium px-3 py-2 text-right">Avg order value</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((c) => (
            <tr key={c.id} className="border-b border-line last:border-0">
              <td className="px-3 py-2">
                <p className="text-ink">{c.name}</p>
                <p className="text-xs text-faint font-mono">{c.id}</p>
              </td>
              <td className="px-3 py-2 text-muted">{c.lastOrderDaysAgo} days ago</td>
              <td className="px-3 py-2 text-right font-mono tabular">{formatINR(c.avgOrderValue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
