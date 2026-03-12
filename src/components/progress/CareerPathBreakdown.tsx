'use client';

import { CAREER_PATH_LABELS, CareerPath } from '@/lib/types';

interface PathData {
  path: CareerPath;
  count: number;
  color: string;
}

const PATH_DATA: PathData[] = [
  { path: 'pe_operating', count: 12, color: 'bg-blue-500' },
  { path: 'board_portfolio', count: 8, color: 'bg-purple-500' },
  { path: 'cso_president', count: 7, color: 'bg-green-500' },
  { path: 'consulting', count: 5, color: 'bg-yellow-500' },
  { path: 'vc_growth', count: 4, color: 'bg-orange-500' },
  { path: 'founder', count: 3, color: 'bg-red-500' },
  { path: 'coaching_advisory', count: 2, color: 'bg-pink-500' },
];

export function CareerPathBreakdown() {
  const total = PATH_DATA.reduce((sum, d) => sum + d.count, 0);
  const sorted = [...PATH_DATA].sort((a, b) => b.count - a.count);

  // Find the weakest area
  const weakest = sorted[sorted.length - 1];

  return (
    <div className="card">
      <h2 className="font-bold text-gray-900 mb-3">Network by Career Path</h2>

      {/* Stacked bar */}
      <div className="flex h-3 rounded-full overflow-hidden mb-4">
        {sorted.map((d) => (
          <div
            key={d.path}
            className={`${d.color} transition-all duration-500`}
            style={{ width: `${(d.count / total) * 100}%` }}
          />
        ))}
      </div>

      {/* List */}
      <div className="space-y-2">
        {sorted.map((d) => (
          <div key={d.path} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2.5 h-2.5 rounded-full ${d.color}`} />
              <span className="text-sm text-gray-700">
                {CAREER_PATH_LABELS[d.path]}
              </span>
            </div>
            <span className="text-sm font-medium text-gray-900">{d.count}</span>
          </div>
        ))}
      </div>

      {/* Insight */}
      <div className="mt-4 p-3 bg-amber-50 rounded-lg">
        <p className="text-xs text-amber-800">
          💡 <strong>Gap:</strong> {CAREER_PATH_LABELS[weakest.path]} has the fewest contacts ({weakest.count}).
          Consider targeting more connections in this space.
        </p>
      </div>
    </div>
  );
}
