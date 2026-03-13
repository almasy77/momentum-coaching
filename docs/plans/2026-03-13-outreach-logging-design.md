# Outreach Logging Feature Design

## Problem
- "Log Outreach" button on dashboard goes to contacts page with no logging UI
- Contact detail has no way to record interactions
- Notes on contact detail are read-only
- No outreach history visible anywhere

## Design

### 1. Quick Log Form (slide-up sheet on contact detail)
- Date: auto-fills today, tappable to change
- Type: pill selector — Call, Email, LinkedIn, Text, Meeting
- Note: single textarea (2 lines)
- Follow-up date: optional date picker
- On save: writes OutreachEntry to Redis, updates contact's lastContacted

### 2. Editable Notes (tap-to-edit on contact detail)
- Tap notes card → becomes editable textarea
- Auto-saves on blur via PATCH to /api/contacts

### 3. Activity Timeline (below notes on contact detail)
- Shows all outreach entries for contact in reverse chronological order
- Compact cards: icon + type + date + note + follow-up if set
- Fetched from /api/outreach?contactId=xxx

### Data Model
- Uses existing OutreachEntry type (types.ts)
- Redis keys: momentum:outreach:{id} for entry data
- New Redis key: momentum:contact:{contactId}:outreach (set of entry IDs per contact)
- API route: /api/outreach (GET with contactId query, POST, DELETE)

### Dashboard Fix
- "Log Outreach" quick action → /contacts?action=log
- Contacts page handles action=log: pick contact → open log form

## Scope
- Quick log form only (no "more details" expandable)
- No editing of past outreach entries (can add later)
- No outreach import from Excel (manual entry going forward)
