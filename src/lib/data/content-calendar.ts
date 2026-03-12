export interface CalendarWeek {
  week: number;
  phase: string;
  theme: string;
  posts: CalendarPost[];
}

export interface CalendarPost {
  id: string;
  day: string;
  title: string;
  format: string;
  hook: string;
  status: 'planned' | 'drafted' | 'ready' | 'published';
}

export const CONTENT_CALENDAR: CalendarWeek[] = [
  {
    week: 1,
    phase: 'Establish Your Voice',
    theme: 'Leadership & Global Teams',
    posts: [
      {
        id: 'w1p1',
        day: 'Tuesday',
        title: 'Dublin Team Lunch — Building Trust in Person',
        format: 'Personal Story + Framework',
        hook: "You can't build trust on Zoom.",
        status: 'ready',
      },
      {
        id: 'w1p2',
        day: 'Thursday',
        title: 'Cork Strategy Session — Proximity Creates Clarity',
        format: 'Numbered Insights',
        hook: "The best strategy I've ever seen wasn't built in a boardroom.",
        status: 'drafted',
      },
    ],
  },
  {
    week: 2,
    phase: 'Establish Your Voice',
    theme: 'Strategy & Transformation',
    posts: [
      {
        id: 'w2p1',
        day: 'Tuesday',
        title: 'What 14 Years of Consulting Taught Me About Corporate Strategy',
        format: 'Listicle',
        hook: 'I spent 14 years telling companies what to do. Then I had to actually do it.',
        status: 'planned',
      },
      {
        id: 'w2p2',
        day: 'Thursday',
        title: 'The One Question That Changes Every Strategy Conversation',
        format: 'Quick Take',
        hook: "Most strategy sessions start with the wrong question.",
        status: 'planned',
      },
    ],
  },
  {
    week: 3,
    phase: 'Establish Your Voice',
    theme: 'M&A and Deal-Making',
    posts: [
      {
        id: 'w3p1',
        day: 'Tuesday',
        title: 'What I Learned from a $3.2B Acquisition',
        format: 'Personal Story + Lessons',
        hook: "The biggest deal of my career almost didn't happen.",
        status: 'planned',
      },
      {
        id: 'w3p2',
        day: 'Thursday',
        title: 'Due Diligence Is Not Just Financial',
        format: 'Framework',
        hook: 'Everyone checks the numbers. Almost nobody checks the culture.',
        status: 'planned',
      },
    ],
  },
  {
    week: 4,
    phase: 'Establish Your Voice',
    theme: 'Team Building & Talent',
    posts: [
      {
        id: 'w4p1',
        day: 'Tuesday',
        title: 'How I Recruited Google and Facebook Talent Into PepsiCo',
        format: 'Personal Story',
        hook: "Nobody at Google wanted to join a beverage company. Until I changed the pitch.",
        status: 'planned',
      },
      {
        id: 'w4p2',
        day: 'Thursday',
        title: 'The Best Hire I Ever Made',
        format: 'Story + Takeaway',
        hook: "She wasn't the most qualified candidate on paper.",
        status: 'planned',
      },
    ],
  },
  {
    week: 5,
    phase: 'Deepen Expertise',
    theme: 'Innovation & Ventures',
    posts: [
      {
        id: 'w5p1',
        day: 'Tuesday',
        title: 'Building a Startup Inside a Fortune 50',
        format: 'Numbered Insights',
        hook: 'They gave me a mandate, a budget, and zero playbook.',
        status: 'planned',
      },
      {
        id: 'w5p2',
        day: 'Thursday',
        title: 'Why Most Corporate Innovation Fails (And What to Do Instead)',
        format: 'Framework',
        hook: "Innovation labs are where good ideas go to die.",
        status: 'planned',
      },
    ],
  },
  {
    week: 6,
    phase: 'Deepen Expertise',
    theme: 'Governance & Board Readiness',
    posts: [
      {
        id: 'w6p1',
        day: 'Tuesday',
        title: 'What Boards Actually Need (From Someone Who Advises Them)',
        format: 'Listicle',
        hook: "Board seats aren't rewards for a good career. They're jobs.",
        status: 'planned',
      },
      {
        id: 'w6p2',
        day: 'Thursday',
        title: 'The Compensation Mistake 90% of Boards Make',
        format: 'Quick Take',
        hook: "I've designed exec comp for 15+ Fortune 500 companies. Most get one thing wrong.",
        status: 'planned',
      },
    ],
  },
  {
    week: 7,
    phase: 'Deepen Expertise',
    theme: 'Data-Driven Decision Making',
    posts: [
      {
        id: 'w7p1',
        day: 'Tuesday',
        title: 'Strategy Without Data Is Just Opinion',
        format: 'Framework',
        hook: "The most expensive decisions in business are the ones made on gut feeling.",
        status: 'planned',
      },
      {
        id: 'w7p2',
        day: 'Thursday',
        title: 'How We Used Data to Enter a $50B Category',
        format: 'Case Study',
        hook: 'Everyone said it was too risky. The data said otherwise.',
        status: 'planned',
      },
    ],
  },
  {
    week: 8,
    phase: 'Deepen Expertise',
    theme: 'Personal Leadership Journey',
    posts: [
      {
        id: 'w8p1',
        day: 'Tuesday',
        title: 'First-Gen, LGBTQ+, and Leading at the Top',
        format: 'Personal Story',
        hook: "Nobody in my family had ever worked in an office.",
        status: 'planned',
      },
      {
        id: 'w8p2',
        day: 'Thursday',
        title: 'What Marshall Goldsmith Taught Me About My Own Blind Spots',
        format: 'Reflective',
        hook: "My coach asked me one question that changed how I lead.",
        status: 'planned',
      },
    ],
  },
  {
    week: 9,
    phase: 'Position for Opportunities',
    theme: 'Industry Trends & POVs',
    posts: [
      {
        id: 'w9p1',
        day: 'Tuesday',
        title: 'The Future of CPG Is Not What You Think',
        format: 'Thought Leadership',
        hook: "Everyone's talking about DTC. They're missing the bigger shift.",
        status: 'planned',
      },
      {
        id: 'w9p2',
        day: 'Thursday',
        title: 'Why Private Equity Needs More Operators (Not More MBAs)',
        format: 'Point of View',
        hook: "PE firms are drowning in spreadsheet jockeys and starving for operators.",
        status: 'planned',
      },
    ],
  },
  {
    week: 10,
    phase: 'Position for Opportunities',
    theme: 'Network & Relationships',
    posts: [
      {
        id: 'w10p1',
        day: 'Tuesday',
        title: 'The Networking Advice I Wish I Had 20 Years Ago',
        format: 'Listicle',
        hook: "I used to think networking was collecting business cards.",
        status: 'planned',
      },
      {
        id: 'w10p2',
        day: 'Thursday',
        title: 'How I Maintain 200+ Active Professional Relationships',
        format: 'System/Framework',
        hook: "Relationships don't maintain themselves. Here's my system.",
        status: 'planned',
      },
    ],
  },
  {
    week: 11,
    phase: 'Position for Opportunities',
    theme: 'Career Transitions',
    posts: [
      {
        id: 'w11p1',
        day: 'Tuesday',
        title: 'What I Tell Every Executive Considering Their Next Move',
        format: 'Advisory',
        hook: "The best career moves feel terrifying at the time.",
        status: 'planned',
      },
      {
        id: 'w11p2',
        day: 'Thursday',
        title: 'The Question Every Senior Leader Should Ask Themselves Right Now',
        format: 'Provocative',
        hook: "If your company announced your departure tomorrow, who would call you?",
        status: 'planned',
      },
    ],
  },
  {
    week: 12,
    phase: 'Position for Opportunities',
    theme: 'Legacy & Impact',
    posts: [
      {
        id: 'w12p1',
        day: 'Tuesday',
        title: 'What I Want My Career to Stand For',
        format: 'Personal Reflection',
        hook: "After 20 years in strategy, I've learned that impact isn't measured in deals.",
        status: 'planned',
      },
      {
        id: 'w12p2',
        day: 'Thursday',
        title: '12 Weeks of Showing Up: What Posting on LinkedIn Taught Me',
        format: 'Reflective + CTA',
        hook: "12 weeks ago, I hit publish for the first time. Here's what happened.",
        status: 'planned',
      },
    ],
  },
];
