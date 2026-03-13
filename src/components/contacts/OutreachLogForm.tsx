'use client';

import { useState } from 'react';
import { OutreachEntry } from '@/lib/types';

const OUTREACH_TYPES = [
  { value: 'call', label: 'Call', icon: '📞' },
  { value: 'email', label: 'Email', icon: '✉️' },
  { value: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { value: 'meeting', label: 'Meeting', icon: '🤝' },
  { value: 'other', label: 'Text', icon: '📱' },
] as const;

interface OutreachLogFormProps {
  contactId: string;
  contactName: string;
  onSave: (entry: Omit<OutreachEntry, 'id'>) => void;
  onCancel: () => void;
}

export function OutreachLogForm({ contactId, contactName, onSave, onCancel }: OutreachLogFormProps) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [type, setType] = useState<OutreachEntry['type']>('call');
  const [notes, setNotes] = useState('');
  const [followUpDate, setFollowUpDate] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    onSave({
      contactId,
      date,
      type,
      subject: '',
      notes,
      actionItems: '',
      followUpDate: followUpDate || null,
      followUpComplete: false,
      weekNumber: 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      {/* Sheet */}
      <div className="relative w-full max-w-lg bg-white rounded-t-2xl p-5 pb-24 animate-slide-up max-h-[85vh] overflow-y-auto">
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

        <h3 className="text-lg font-bold text-gray-900 mb-1">Log Outreach</h3>
        <p className="text-sm text-gray-500 mb-4">with {contactName}</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date */}
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>

          {/* Type pills */}
          <div>
            <span className="text-xs font-medium text-gray-500 uppercase">Type</span>
            <div className="flex gap-2 mt-1 overflow-x-auto pb-1">
              {OUTREACH_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium transition-colors
                    ${type === t.value
                      ? 'bg-brand-600 text-white'
                      : 'bg-gray-100 text-gray-600 active:bg-gray-200'
                    }`}
                >
                  <span>{t.icon}</span>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Note</span>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              placeholder="What happened? Key takeaways..."
              autoFocus
            />
          </label>

          {/* Follow-up */}
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Follow-up date (optional)</span>
            <input
              type="date"
              value={followUpDate}
              onChange={(e) => setFollowUpDate(e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl text-sm font-medium text-gray-500 bg-gray-100">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1">
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
