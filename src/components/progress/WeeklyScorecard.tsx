'use client';

interface GoalProps {
  label: string;
  emoji: string;
  value: number;
  target: number;
}

function GoalRow({ label, emoji, value, target }: GoalProps) {
  const pct = Math.min((value / target) * 100, 100);
  const color = pct >= 100 ? 'bg-green-500' : pct >= 70 ? 'bg-yellow-500' : pct >= 30 ? 'bg-brand-500' : 'bg-gray-300';

  return (
    <div className="flex items-center gap-3">
      <span className="text-lg w-7 text-center">{emoji}</span>
      <div className="flex-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-700">{label}</span>
          <span className={`font-bold ${pct >= 100 ? 'text-green-600' : 'text-gray-600'}`}>
            {value}/{target}
          </span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${color}`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export function WeeklyScorecard() {
  // TODO: Replace with real data from Upstash
  const weekNumber = 3;
  const totalWeeks = 12;
  const weekPct = Math.round((weekNumber / totalWeeks) * 100);

  const goals = [
    { label: 'Outreach', emoji: '📞', value: 8, target: 10 },
    { label: 'Follow-ups', emoji: '🔄', value: 5, target: 7 },
    { label: 'LinkedIn Posts', emoji: '📝', value: 1, target: 2 },
    { label: 'New Contacts', emoji: '🤝', value: 3, target: 5 },
  ];

  return (
    <div className="card space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900">Week {weekNumber} of {totalWeeks}</h2>
        <span className="text-sm text-gray-500">{weekPct}%</span>
      </div>

      {/* Overall progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-700"
          style={{ width: `${weekPct}%` }}
        />
      </div>

      <div className="space-y-3 pt-1">
        {goals.map((goal) => (
          <GoalRow key={goal.label} {...goal} />
        ))}
      </div>
    </div>
  );
}
