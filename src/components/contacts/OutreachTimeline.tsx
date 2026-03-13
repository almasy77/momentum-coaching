'use client';

import { OutreachEntry } from '@/lib/types';

const TYPE_ICONS: Record<OutreachEntry['type'], string> = {
  call: '📞',
  email: '✉️',
  linkedin: '💼',
  coffee: '☕',
  meeting: '🤝',
  introduction: '🔗',
  other: '📱',
};

const TYPE_LABELS: Record<OutreachEntry['type'], string> = {
  call: 'Call',
  email: 'Email',
  linkedin: 'LinkedIn',
  coffee: 'Coffee',
  meeting: 'Meeting',
  introduction: 'Introduction',
  other: 'Text',
};

interface OutreachTimelineProps {
  entries: OutreachEntry[];
}

export function OutreachTimeline({ entries }: OutreachTimelineProps) {
  if (entries.length === 0) {
    return (
      <div className="card">
        <h3 className="text-xs font-medium text-gray-400 uppercase mb-2">Activity</h3>
        <p className="text-sm text-gray-400 text-center py-4">No outreach logged yet</p>
      </div>
    );
  }

  const formatDate = (d: string) => {
    // Append T00:00:00 to date-only strings so they parse as local time, not UTC
    const iso = d.includes('T') ? d : `${d}T00:00:00`;
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="card">
      <h3 className="text-xs font-medium text-gray-400 uppercase mb-3">
        Activity ({entries.length})
      </h3>
      <div className="space-y-3">
        {entries.map((entry) => (
          <div key={entry.id} className="flex gap-3 pb-3 border-b border-gray-50 last:border-0 last:pb-0">
            <span className="text-lg shrink-0 mt-0.5">{TYPE_ICONS[entry.type] || '📋'}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-800">
                  {TYPE_LABELS[entry.type] || entry.type}
                </span>
                <span className="text-xs text-gray-400">{formatDate(entry.date)}</span>
              </div>
              {entry.notes && (
                <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{entry.notes}</p>
              )}
              {entry.followUpDate && !entry.followUpComplete && (
                <p className="text-xs text-orange-600 mt-1">
                  ↳ Follow up by {formatDate(entry.followUpDate)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
