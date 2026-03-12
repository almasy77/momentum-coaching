'use client';

import { useState } from 'react';
import { LinkedInPreview } from './LinkedInPreview';
import { GoldenHourChecklist } from './GoldenHourChecklist';

interface DraftWorkshopProps {
  initialTitle?: string;
  initialHook?: string;
  onBack: () => void;
}

export function DraftWorkshop({ initialTitle, initialHook, onBack }: DraftWorkshopProps) {
  const [title, setTitle] = useState(initialTitle ?? '');
  const [body, setBody] = useState(initialHook ? initialHook + '\n\n' : '');
  const [showPreview, setShowPreview] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);

  const charCount = body.length;
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-brand-600 font-medium">
          ← Back
        </button>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              showPreview ? 'bg-brand-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Preview
          </button>
          <button
            onClick={() => setShowChecklist(!showChecklist)}
            className={`text-xs px-3 py-1 rounded-full font-medium ${
              showChecklist ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
          >
            Publish ✓
          </button>
        </div>
      </div>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Post title (for your reference)"
        className="w-full text-lg font-bold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-brand-500 bg-transparent"
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Start writing your post...&#10;&#10;Tip: The first 210 characters appear before 'See more' on mobile."
        rows={12}
        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
      />

      {/* Stats bar */}
      <div className="flex justify-between text-xs text-gray-400 px-1">
        <span>{wordCount} words &middot; {charCount} characters</span>
        <span className={charCount > 3000 ? 'text-red-500' : ''}>
          {charCount > 3000 ? 'Over limit' : `${3000 - charCount} chars left`}
        </span>
      </div>

      {/* LinkedIn preview */}
      {showPreview && (
        <LinkedInPreview body={body} />
      )}

      {/* Golden Hour Checklist */}
      {showChecklist && (
        <GoldenHourChecklist />
      )}

      {/* Action buttons */}
      <div className="flex gap-3">
        <button className="btn-secondary flex-1">Save Draft</button>
        <button className="btn-primary flex-1">Mark Ready</button>
      </div>
    </div>
  );
}
