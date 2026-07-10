import React from 'react';

function BarRow({ label, rate, visited, total, flagged }) {
  return (
    <div className="mb-3">
      <div className="flex justify-between text-[12.5px] mb-1">
        <span className="font-semibold">{label}</span>
        <span className={flagged ? 'text-flag font-bold' : ''}>
          {rate}% ({visited}/{total}){flagged ? ' — below average' : ''}
        </span>
      </div>
      <div className="h-2.5 bg-paper rounded-full overflow-hidden border border-rule">
        <div
          className={`h-full rounded-full transition-all duration-500 ${flagged ? 'bg-flag' : 'bg-seal'}`}
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}

export default function AnalyticsPanel({ analytics }) {
  if (!analytics) return null;

  return (
    <div>
      <div className="font-display font-semibold mb-2.5">Coverage</div>

      <div className="bg-paperRaised border border-rule rounded-[10px] p-4 mb-4">
        <div className="font-display font-semibold text-4xl leading-none">{analytics.overallRate}%</div>
        <div className="text-xs text-inkSoft mt-1">of everyone on the list has had a visit</div>
      </div>

      <div className="bg-paperRaised border border-rule rounded-[10px] p-4 mb-4">
        <div className="font-display font-semibold text-sm mb-2.5">By neighborhood</div>
        {analytics.byNeighborhood.length === 0 && (
          <div className="text-inkSoft text-sm text-center py-6">No one added yet.</div>
        )}
        {analytics.byNeighborhood.map((row) => (
          <BarRow
            key={row.neighborhood}
            label={row.neighborhood}
            rate={row.rate}
            visited={row.visited}
            total={row.total}
            flagged={row.flagged}
          />
        ))}
      </div>

      <div className="bg-paperRaised border border-rule rounded-[10px] p-4">
        <div className="font-display font-semibold text-sm mb-2.5">By age group</div>
        {analytics.byAgeCohort
          .filter((c) => c.total > 0)
          .map((row) => (
            <BarRow
              key={row.label}
              label={`Age ${row.label}`}
              rate={row.rate}
              visited={row.visited}
              total={row.total}
              flagged={row.flagged}
            />
          ))}
      </div>
    </div>
  );
}
