'use client';

import { useState } from 'react';
import { CONTENT_CALENDAR, CalendarWeek, CalendarPost } from '@/lib/data/content-calendar';

const STATUS_STYLES = {
  planned: 'bg-gray-100 text-gray-500',
  drafted: 'bg-yellow-100 text-yellow-700',
  ready: 'bg-green-100 text-green-700',
  published: 'bg-brand-100 text-brand-700',
};

function PostCard({ post, onSelect }: { post: CalendarPost; onSelect: (post: CalendarPost) => void }) {
  return (
    <button
      onClick={() => onSelect(post)}
      className="card w-full text-left active:scale-[0.99] transition-transform"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400">{post.day} &middot; {post.format}</p>
          <h4 className="text-sm font-semibold text-gray-900 mt-0.5 line-clamp-2">
            {post.title}
          </h4>
          <p className="text-xs text-gray-500 mt-1 italic line-clamp-1">
            &ldquo;{post.hook}&rdquo;
          </p>
        </div>
        <span className={`badge shrink-0 ${STATUS_STYLES[post.status]}`}>
          {post.status}
        </span>
      </div>
    </button>
  );
}

interface ContentCalendarProps {
  onSelectPost: (post: CalendarPost) => void;
}

export function ContentCalendar({ onSelectPost }: ContentCalendarProps) {
  const [expandedWeek, setExpandedWeek] = useState<number>(1);

  const phases = [
    { name: 'Establish Your Voice', weeks: [1, 2, 3, 4], color: 'bg-blue-500' },
    { name: 'Deepen Expertise', weeks: [5, 6, 7, 8], color: 'bg-purple-500' },
    { name: 'Position for Opportunities', weeks: [9, 10, 11, 12], color: 'bg-green-500' },
  ];

  return (
    <div className="space-y-4">
      {/* Phase indicators */}
      <div className="flex gap-1 h-2 rounded-full overflow-hidden">
        {phases.map((phase) => (
          <div key={phase.name} className={`flex-1 ${phase.color}`} title={phase.name} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-gray-400 px-1">
        <span>Weeks 1-4</span>
        <span>Weeks 5-8</span>
        <span>Weeks 9-12</span>
      </div>

      {/* Weeks */}
      {CONTENT_CALENDAR.map((week) => (
        <div key={week.week} className="space-y-2">
          <button
            onClick={() => setExpandedWeek(expandedWeek === week.week ? 0 : week.week)}
            className="w-full flex items-center justify-between py-2"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">
                Week {week.week}
              </span>
              <span className="text-xs text-gray-400">{week.theme}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                {week.posts.filter((p) => p.status === 'published').length}/{week.posts.length}
              </span>
              <span className={`text-gray-400 transition-transform ${expandedWeek === week.week ? 'rotate-180' : ''}`}>
                ▾
              </span>
            </div>
          </button>

          {expandedWeek === week.week && (
            <div className="space-y-2 pl-1">
              {week.posts.map((post) => (
                <PostCard key={post.id} post={post} onSelect={onSelectPost} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
