# Today Dashboard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace placeholder Today page with live follow-up alerts, weekly outreach goal counter, and import historical outreach from Excel.

**Architecture:** Client components fetch from existing `/api/contacts` and a new `/api/outreach/weekly` endpoint. Historical outreach seeded via a one-time script using `/api/outreach` POST.

**Tech Stack:** Next.js App Router, React client components, Upstash Redis, Tailwind CSS

---

### Task 1: Create `/api/outreach/weekly` endpoint

**Files:**
- Create: `src/app/api/outreach/weekly/route.ts`

**Step 1: Create the weekly outreach API route**

```typescript
import { NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';
import { OutreachEntry } from '@/lib/types';

function getWeekBounds(): { start: string; end: string } {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  const fmt = (d: Date) => d.toISOString().split('T')[0];
  return { start: fmt(monday), end: fmt(sunday) };
}

export async function GET() {
  try {
    const { start, end } = getWeekBounds();
    const allIds = await redis.smembers(keys.outreach);
    if (!allIds || allIds.length === 0) {
      return NextResponse.json({ entries: [], count: 0, goal: 5, weekStart: start, weekEnd: end });
    }
    const pipeline = redis.pipeline();
    allIds.forEach((id) => pipeline.get(keys.outreachEntry(id as string)));
    const results = await pipeline.exec();
    const entries = results
      .filter(Boolean)
      .map((e) => (typeof e === 'string' ? JSON.parse(e) : e) as OutreachEntry)
      .filter((e) => e.date >= start && e.date <= end)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return NextResponse.json({ entries, count: entries.length, goal: 5, weekStart: start, weekEnd: end });
  } catch (error) {
    console.error('Failed to fetch weekly outreach:', error);
    return NextResponse.json({ entries: [], count: 0, goal: 5 }, { status: 500 });
  }
}
```

**Step 2: Verify endpoint works**

Run: `curl -s https://momentum-coaching-psi.vercel.app/api/outreach/weekly | python3 -m json.tool`
Expected: JSON with `count`, `goal: 5`, `entries` array

**Step 3: Commit**

```bash
git add src/app/api/outreach/weekly/route.ts
git commit -m "feat: add /api/outreach/weekly endpoint for weekly goal tracking"
```

---

### Task 2: Build `FollowUpAlerts` component

**Files:**
- Create: `src/components/today/FollowUpAlerts.tsx`

**Step 1: Create the component**

```typescript
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
        Follow-ups {overdue.length > 0 && (
          <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full ml-1">
            {overdue.length}
          </span>
        )}
      </h2>
      <div className="space-y-2">
        {overdue.map(({ contact, daysOverdue }) => (
          <Link key={contact.id} href={`/contacts?selected=${contact.id}`} className="card flex items-center gap-3 border-red-100 bg-red-50/50 active:scale-[0.98] transition-transform">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
              <p className="text-xs text-gray-500 truncate">{contact.title} · {contact.organization}</p>
            </div>
            <span className="text-xs font-semibold text-red-600 shrink-0">{daysOverdue}d overdue</span>
          </Link>
        ))}
        {upcoming.map(({ contact, daysOverdue }) => (
          <Link key={contact.id} href={`/contacts?selected=${contact.id}`} className="card flex items-center gap-3 border-amber-100 bg-amber-50/50 active:scale-[0.98] transition-transform">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{contact.name}</p>
              <p className="text-xs text-gray-500 truncate">{contact.title} · {contact.organization}</p>
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
```

**Step 2: Commit**

```bash
git add src/components/today/FollowUpAlerts.tsx
git commit -m "feat: add FollowUpAlerts component with overdue/upcoming contacts"
```

---

### Task 3: Build `WeeklyGoal` component

**Files:**
- Create: `src/components/today/WeeklyGoal.tsx`

**Step 1: Create the component**

```typescript
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export function WeeklyGoal() {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/outreach/weekly');
        const data = await res.json();
        setCount(data.count);
        setGoal(data.goal);
      } catch (err) {
        console.error('Failed to load weekly goal:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const pct = Math.min((count / goal) * 100, 100);
  const complete = count >= goal;

  return (
    <Link href="/contacts" className="card block active:scale-[0.98] transition-transform">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
          This Week
        </h2>
        <span className={`text-sm font-bold ${complete ? 'text-green-600' : 'text-gray-700'}`}>
          {loading ? '...' : `${count} of ${goal}`}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            complete ? 'bg-green-500' : pct >= 50 ? 'bg-brand-500' : 'bg-brand-300'
          }`}
          style={{ width: loading ? '0%' : `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-400 mt-1.5">
        {complete ? '🎉 Goal reached!' : `${goal - count} more outreach to hit your goal`}
      </p>
    </Link>
  );
}
```

**Step 2: Commit**

```bash
git add src/components/today/WeeklyGoal.tsx
git commit -m "feat: add WeeklyGoal progress bar component"
```

---

### Task 4: Update Today page layout

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Replace OutreachSummary with new components**

```typescript
import { GreetingCard } from '@/components/today/GreetingCard';
import { QuoteCard } from '@/components/today/QuoteCard';
import { FollowUpAlerts } from '@/components/today/FollowUpAlerts';
import { WeeklyGoal } from '@/components/today/WeeklyGoal';
import { QuickActions } from '@/components/today/QuickActions';

export default function TodayPage() {
  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <GreetingCard />
      <FollowUpAlerts />
      <WeeklyGoal />
      <QuickActions />
      <QuoteCard />
    </div>
  );
}
```

**Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire live FollowUpAlerts and WeeklyGoal into Today page"
```

---

### Task 5: Seed historical outreach from Excel

**Files:**
- Create: `src/lib/data/seed-outreach-history.ts`
- Modify: `src/app/api/seed/route.ts`

**Step 1: Create seed data file**

```typescript
import { OutreachEntry } from '@/lib/types';

export const HISTORICAL_OUTREACH: Omit<OutreachEntry, 'id'>[] = [
  {
    contactId: 'c-brian-newman',
    date: '2026-02-16',
    type: 'linkedin',
    subject: 'Reconnect',
    notes: 'Sent LinkedIn reconnect message. Referenced career advice from corporate jet years ago. Asked to catch up about CSO search.',
    actionItems: '',
    followUpDate: '2026-02-23',
    followUpComplete: false,
    weekNumber: 1,
  },
  {
    contactId: 'c-melissa-mckerracher',
    date: '2026-02-16',
    type: 'email',
    subject: 'Reconnect Joe & Mel',
    notes: 'Sent reconnect email. Congratulated on Novartis CFO role. Proposed phone or video catch-up.',
    actionItems: '',
    followUpDate: null,
    followUpComplete: false,
    weekNumber: 1,
  },
  {
    contactId: 'c-yuan-wang',
    date: '2026-02-16',
    type: 'other',
    subject: '',
    notes: 'Sent text: Happy lunar new year! Asked to connect this or next week.',
    actionItems: '',
    followUpDate: null,
    followUpComplete: false,
    weekNumber: 1,
  },
];
```

**Step 2: Update seed route to include outreach history**

Add outreach seeding to the existing seed route's POST handler, after contacts are seeded. Import `HISTORICAL_OUTREACH` and for each entry, generate a UUID, POST to the outreach keys (outreachEntry, outreach set, contactOutreach set).

**Step 3: Trigger seed**

Run: `curl -X POST https://momentum-coaching-psi.vercel.app/api/seed -H 'Content-Type: application/json' -d '{"force": true}'`

**Step 4: Commit**

```bash
git add src/lib/data/seed-outreach-history.ts src/app/api/seed/route.ts
git commit -m "feat: seed historical outreach entries from Excel data"
```

---

### Task 6: Push, deploy, and verify

**Step 1: Push all commits**

```bash
git push
```

**Step 2: Verify Today page**

Open `https://momentum-coaching-psi.vercel.app/` and confirm:
- Follow-up alerts show Brian Newman as overdue (nextFollowUp was 2026-02-23)
- Weekly goal shows current week's count
- Quick actions and quote card are at bottom

**Step 3: Verify outreach history**

Navigate to Brian Newman's contact detail and confirm 2/16 LinkedIn outreach appears in the Activity timeline.
