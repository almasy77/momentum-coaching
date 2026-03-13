'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Contact } from '@/lib/types';

interface AlertContact {
  contact: Contact;
  daysOverdue: number;
}

export function FollowUpAlerts() {
  const [overdue, setOverdue] = useState<AlertContact[]>([]);
  const [upcoming, setUpcoming] = useState<AlertContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/contacts');
        const contacts: Contact[] = await res.json();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeDays = new Date(today);
        threeDays.setDate(today.getDate() + 3);

        const overdueList: AlertContact[] = [];
        const upcomingList: AlertContact[] = [];

        for (const c of contacts) {
          if (!c.nextFollowUp) continue;
          const fup = new Date(c.nextFollowUp + 'T00:00:00');
          const diffMs = today.getTime() - fup.getTime();
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          if (diffDays > 0) {
            overdueList.push({ contact: c, daysOverdue: diffDays });
          } else if (fup <= threeDays) {
            upcomingList.push({ contact: c, daysOverdue: diffDays });
          }
        }

        overdueList.sort((a, b) => b.daysOverdue - a.daysOverdue);
        setOverdue(overdueList);
        setUpcoming(upcomingList);
      } catch (err) {
        console.error('Failed to load follow-ups:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="card">
        <div className="h-20 flex items-center justify-center">
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  if (overdue.length === 0 && upcoming.length === 0) {
    return (
      <div className="card text-center py-4">
        <span className="text-2xl">🎉</span>
        <p className="text-sm font-medium text-gray-600 mt-1">You&apos;re all caught up!</p>
        <p className="text-xs text-gray-400">No follow-ups due</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">
        Follow-ups{' '}
        {overdue.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ml-1">
            {overdue.length}
          </span>
        )}
      </h2>
      <div className="space-y-2">
        {overdue.map(({ contact, daysOverdue }) => (
          <Link
            key={contact.id}
            href={`/contacts?selected=${contact.id}`}
            className="card flex items-center gap-3 border-red-100 bg-red-50/50 active:scale-[0.98] transition-transform"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {contact.title} · {contact.organization}
              </p>
            </div>
            <span className="text-xs font-semibold text-red-600 shrink-0">{daysOverdue}d overdue</span>
          </Link>
        ))}
        {upcoming.map(({ contact, daysOverdue }) => (
          <Link
            key={contact.id}
            href={`/contacts?selected=${contact.id}`}
            className="card flex items-center gap-3 border-amber-100 bg-amber-50/50 active:scale-[0.98] transition-transform"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {contact.title} · {contact.organization}
              </p>
            </div>
            <span className="text-xs font-medium text-amber-600 shrink-0">
              {daysOverdue === 0 ? 'Today' : `In ${Math.abs(daysOverdue)}d`}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
