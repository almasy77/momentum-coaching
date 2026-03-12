'use client';

import { useState } from 'react';

const CHECKLIST_ITEMS = [
  { id: 'present', label: 'I can be present on LinkedIn for the next 60 minutes' },
  { id: 'hashtags', label: 'Added 3-5 relevant hashtags at the end' },
  { id: 'no_links', label: 'No outbound links in the post body' },
  { id: 'cta', label: 'Post ends with a question or call to action' },
  { id: 'hook', label: 'First 2-3 lines will stop the scroll' },
  { id: 'mobile', label: 'Checked mobile preview — looks clean' },
  { id: 'publish', label: 'Published!' },
  { id: 'reply_all', label: 'Replied to every comment within first hour' },
  { id: 'engage', label: 'Liked/commented on 3-5 others\' posts today' },
  { id: 'connections', label: 'Sent 1-2 personalized connection requests' },
];

export function GoldenHourChecklist() {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggle = (id: string) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const progress = checked.size / CHECKLIST_ITEMS.length;

  return (
    <div className="card bg-amber-50 border-amber-200">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-amber-900">🌟 Golden Hour Checklist</h3>
        <span className="text-xs text-amber-600">
          {checked.size}/{CHECKLIST_ITEMS.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-amber-200 rounded-full mb-3 overflow-hidden">
        <div
          className="h-full bg-amber-500 rounded-full transition-all duration-300"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {CHECKLIST_ITEMS.map((item) => (
          <label
            key={item.id}
            className="flex items-start gap-3 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={checked.has(item.id)}
              onChange={() => toggle(item.id)}
              className="mt-0.5 w-4 h-4 rounded border-amber-300 text-amber-600 focus:ring-amber-500"
            />
            <span className={`text-sm ${checked.has(item.id) ? 'text-amber-400 line-through' : 'text-amber-800'}`}>
              {item.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
