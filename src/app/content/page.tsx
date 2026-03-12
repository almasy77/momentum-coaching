'use client';

import { useState } from 'react';
import { ContentCalendar } from '@/components/content/ContentCalendar';
import { DraftWorkshop } from '@/components/content/DraftWorkshop';
import { CalendarPost } from '@/lib/data/content-calendar';

type View = 'calendar' | 'draft';

export default function ContentPage() {
  const [view, setView] = useState<View>('calendar');
  const [selectedPost, setSelectedPost] = useState<CalendarPost | null>(null);

  const handleSelectPost = (post: CalendarPost) => {
    setSelectedPost(post);
    setView('draft');
  };

  return (
    <div className="px-4 pt-12 pb-6">
      {view === 'calendar' && (
        <>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Content</h1>
              <p className="text-sm text-gray-500 mt-1">12-week LinkedIn plan</p>
            </div>
            <button
              onClick={() => {
                setSelectedPost(null);
                setView('draft');
              }}
              className="text-sm bg-brand-600 text-white px-3 py-1.5 rounded-lg font-medium active:scale-95 transition-transform"
            >
              + New Draft
            </button>
          </div>
          <ContentCalendar onSelectPost={handleSelectPost} />
        </>
      )}

      {view === 'draft' && (
        <DraftWorkshop
          initialTitle={selectedPost?.title}
          initialHook={selectedPost?.hook}
          onBack={() => setView('calendar')}
        />
      )}
    </div>
  );
}
