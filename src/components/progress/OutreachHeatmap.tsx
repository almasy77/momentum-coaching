'use client';

// GitHub-style contribution heatmap for outreach activity
function generateSampleData(): number[][] {
  // 12 weeks x 5 days (Mon-Fri), values 0-4
  const data: number[][] = [];
  for (let week = 0; week < 12; week++) {
    const row: number[] = [];
    for (let day = 0; day < 5; day++) {
      // More recent weeks have more activity (simulating ramp-up)
      const base = Math.min(week / 4, 1);
      row.push(Math.floor(Math.random() * 4 * base));
    }
    data.push(row);
  }
  return data;
}

const INTENSITY = [
  'bg-gray-100',
  'bg-brand-200',
  'bg-brand-400',
  'bg-brand-600',
];

const DAYS = ['M', 'T', 'W', 'T', 'F'];

export function OutreachHeatmap() {
  const data = generateSampleData();

  // Calculate streaks
  const currentStreak = 4;
  const bestStreak = 11;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900">Outreach Activity</h2>
        <span className="text-sm text-orange-500 font-medium">🔥 {currentStreak} day streak</span>
      </div>

      {/* Heatmap grid */}
      <div className="flex gap-1">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {DAYS.map((day, i) => (
            <div key={i} className="h-4 flex items-center">
              <span className="text-[10px] text-gray-400 w-3">{day}</span>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] flex-1 overflow-x-auto">
          {data.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((value, di) => (
                <div
                  key={di}
                  className={`w-4 h-4 rounded-[3px] ${INTENSITY[Math.min(value, 3)]}`}
                  title={`Week ${wi + 1}, ${DAYS[di]}: ${value} outreach`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs text-gray-400">Best streak: {bestStreak} days</span>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-gray-400">Less</span>
          {INTENSITY.map((cls, i) => (
            <div key={i} className={`w-3 h-3 rounded-[2px] ${cls}`} />
          ))}
          <span className="text-[10px] text-gray-400">More</span>
        </div>
      </div>
    </div>
  );
}
