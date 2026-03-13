export type Warmth = 'hot' | 'warm' | 'cool' | 'cold';
export type Priority = 'high' | 'medium' | 'low';
export type ContactStatus = 'not_started' | 'in_progress' | 'active' | 'on_hold';

export type CareerPath =
  | 'ceo_fortune'
  | 'pe_operating'
  | 'board_portfolio'
  | 'vc_growth'
  | 'consulting'
  | 'founder'
  | 'cso_president'
  | 'coaching_advisory'
  | 'multiple_paths';

export const CAREER_PATH_LABELS: Record<CareerPath, string> = {
  ceo_fortune: 'CEO (Fortune 50)',
  pe_operating: 'PE Operating Partner',
  board_portfolio: 'Board Portfolio',
  vc_growth: 'VC / Growth Equity',
  consulting: 'Consulting Sr Partner',
  founder: 'Founder / Acquisition',
  cso_president: 'CSO / President',
  coaching_advisory: 'Coaching / Advisory',
  multiple_paths: 'Multiple Paths',
};

export const WARMTH_LABELS: Record<Warmth, string> = {
  hot: 'Hot',
  warm: 'Warm',
  cool: 'Cool',
  cold: 'Cold',
};

export interface Contact {
  id: string;
  name: string;
  title: string;
  organization: string;
  careerPath: CareerPath;
  networkSource: string;
  warmth: Warmth;
  email: string;
  phone: string;
  linkedinUrl: string;
  lastContacted: string | null;
  nextFollowUp: string | null;
  priority: Priority;
  status: ContactStatus;
  notes: string;
  createdAt: string;
}

export interface OutreachEntry {
  id: string;
  contactId: string;
  date: string;
  type: 'call' | 'email' | 'linkedin' | 'coffee' | 'meeting' | 'introduction' | 'other';
  subject: string;
  notes: string;
  actionItems: string;
  followUpDate: string | null;
  followUpComplete: boolean;
  weekNumber: number;
}

export interface ContentDraft {
  id: string;
  title: string;
  body: string;
  theme: string;
  careerPath: CareerPath | null;
  weekNumber: number | null;
  status: 'idea' | 'draft' | 'ready' | 'published';
  publishedDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface WeeklyGoals {
  outreach: number;
  followups: number;
  posts: number;
  newContacts: number;
}

export interface DailyProgress {
  date: string;
  outreach: number;
  posts: number;
  followups: number;
  newContacts: number;
}
