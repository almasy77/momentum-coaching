'use client';

interface StatProps {
  label: string;
  value: number;
  target: number;
  emoji: string;
}

function StatRow({ label, value, target, emoji }: StatProps) {
  const pct = Math.min((value / target) * 100, 100);
  const color = pct >= 100 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-gray-300';

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg">{emoji}</span>
      <div className="flex-1">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">
            {value}/{target}
          </span>
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function OutreachSummary() {
  // TODO: Replace with live data from Upstash
  const stats = {
    outreach: { value: 3, target: 10 },
    followups: { value: 2, target: 7 },
    posts: { value: 0, target: 2 },
    newContacts: { value: 1, target: 5 },
  };

  return (
    <div className="card space-y-3">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
        This Week
      </h2>
      <StatRow emoji="📞" label="Outreach" {...stats.outreach} />
      <StatRow emoji="🔄" label="Follow-ups" {...stats.followups} />
      <StatRow emoji="📝" label="LinkedIn Posts" {...stats.posts} />
      <StatRow emoji="🤝" label="New Contacts" {...stats.newContacts} />
    </div>
  );
}
