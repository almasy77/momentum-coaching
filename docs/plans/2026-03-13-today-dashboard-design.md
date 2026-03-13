# Today Dashboard: Follow-Up Alerts, Weekly Goal, Historical Import

**Date:** 2026-03-13
**Status:** Approved

## Problem

The Today page uses hardcoded placeholder data. Follow-up dates exist on contacts but aren't surfaced anywhere. There's no weekly outreach goal tracking. Three contacts have historical outreach in the Excel that should be backfilled.

## Features

### 1. Follow-Up Alerts

Replace the static `OutreachSummary` component with a live `FollowUpAlerts` component.

- Fetch all contacts from `/api/contacts`
- Filter for `nextFollowUp <= today` (overdue) and `nextFollowUp` within next 3 days (upcoming)
- Show overdue contacts as tappable cards: name, days overdue, quick "Log" action
- Red styling for overdue, amber for upcoming
- "You're all caught up" when nothing is due

### 2. Weekly Outreach Goal Counter

New `WeeklyGoal` component showing progress toward 5 outreach touches per week.

- New `/api/outreach/weekly` endpoint: fetches all outreach entries, filters to current Mon-Sun week
- Display: "3 of 5 this week" with progress bar
- Goal is hardcoded to 5 (can be made configurable later)

### 3. Import Historical Outreach

Backfill outreach entries from the Excel Outreach Log sheet for:
- Brian Newman (LinkedIn reconnect 2/16)
- Melissa McKerracher (LinkedIn reconnect 2/16)
- Yuan Wang (LinkedIn reconnect 2/16)

Seed via `/api/outreach` POST endpoint. One-time operation.

## Today Page Layout (top to bottom)

1. GreetingCard (existing)
2. FollowUpAlerts (new — replaces OutreachSummary)
3. WeeklyGoal (new)
4. QuickActions (existing)
5. QuoteCard (existing, moved to bottom)

## API Changes

### GET /api/outreach/weekly
- No params required
- Returns all outreach entries where `date` falls within current Mon-Sun week
- Response: `{ entries: OutreachEntry[], count: number, goal: 5 }`

### GET /api/contacts (existing)
- Already returns all contacts with `nextFollowUp` field — no changes needed

## Data Flow

```
Today Page (server component wrapper)
  └─ FollowUpAlerts (client)
       └─ GET /api/contacts → filter overdue/upcoming
  └─ WeeklyGoal (client)
       └─ GET /api/outreach/weekly → count vs goal
```

## Key Decisions

- Weekly goal hardcoded to 5 (YAGNI — configurable later if needed)
- Week boundary is Monday-Sunday
- Follow-up alerts fetch all contacts client-side (20 contacts is trivial)
- No push notifications — Today page is the notification surface
