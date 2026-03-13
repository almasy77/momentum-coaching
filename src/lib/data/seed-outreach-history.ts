import { OutreachEntry } from '@/lib/types';

export const HISTORICAL_OUTREACH: Omit<OutreachEntry, 'id'>[] = [
  {
    contactId: 'c-brian-newman',
    date: '2026-02-16',
    type: 'linkedin',
    subject: 'Reconnect',
    notes:
      'Sent LinkedIn reconnect message. Referenced career advice from corporate jet years ago. Asked to catch up about CSO search.',
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
    notes:
      'Sent reconnect email. Congratulated on Novartis CFO role. Proposed phone or video catch-up.',
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
