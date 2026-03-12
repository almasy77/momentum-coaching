'use client';

interface Badge {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
  progress?: number; // 0-100 for locked badges
}

const BADGES: Badge[] = [
  { id: 'first_contact', icon: '🚀', name: 'First Contact', description: 'Log first outreach', unlocked: true },
  { id: 'week_warrior', icon: '🔥', name: 'Week Warrior', description: 'Hit all weekly goals', unlocked: true },
  { id: 'content_creator', icon: '📝', name: 'Content Creator', description: 'Publish 5 LinkedIn posts', unlocked: false, progress: 20 },
  { id: 'connector', icon: '🤝', name: 'Connector', description: '25 active contacts', unlocked: false, progress: 64 },
  { id: 'streak_master', icon: '💯', name: 'Streak Master', description: '14-day outreach streak', unlocked: false, progress: 29 },
  { id: 'network_builder', icon: '🏆', name: 'Network Builder', description: '50 active contacts', unlocked: false, progress: 32 },
  { id: 'inner_circle', icon: '⭐', name: 'Inner Circle', description: '10 "Hot" contacts', unlocked: false, progress: 40 },
];

export function BadgeRack() {
  const unlocked = BADGES.filter((b) => b.unlocked).length;

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-bold text-gray-900">Badges</h2>
        <span className="text-xs text-gray-400">{unlocked}/{BADGES.length} unlocked</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
        {BADGES.map((badge) => (
          <div
            key={badge.id}
            className={`shrink-0 w-20 flex flex-col items-center text-center ${
              badge.unlocked ? '' : 'opacity-40'
            }`}
          >
            <div className={`text-3xl mb-1 ${badge.unlocked ? '' : 'grayscale'}`}>
              {badge.icon}
            </div>
            <span className="text-[10px] font-semibold text-gray-700 leading-tight">
              {badge.name}
            </span>
            {!badge.unlocked && badge.progress !== undefined && (
              <div className="w-full h-1 bg-gray-200 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-brand-400 rounded-full"
                  style={{ width: `${badge.progress}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
