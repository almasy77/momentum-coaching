'use client';

import { useState, useEffect } from 'react';

const QUOTES = [
  { text: "What got you here won't get you there.", author: "Marshall Goldsmith" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Your network is the people who want to help you, and you want to help them, for no particular reason.", author: "Reid Hoffman" },
  { text: "The most dangerous leadership myth is that leaders are born.", author: "Warren Bennis" },
  { text: "Strategy is not the consequence of planning, but the opposite: its starting point.", author: "Henry Mintzberg" },
  { text: "One of the most important things you can do on this earth is to let people know they are not alone.", author: "Shannon Alder" },
  { text: "People don't resist change. They resist being changed.", author: "Peter Senge" },
  { text: "The bottleneck is always at the top of the bottle.", author: "Peter Drucker" },
  { text: "You can't build a reputation on what you are going to do.", author: "Henry Ford" },
  { text: "Reach out, make connections, build relationships. Your career depends on it.", author: "Marshall Goldsmith" },
  { text: "Great leaders are almost always great simplifiers.", author: "Colin Powell" },
  { text: "Transformation is not a future event. It is a present activity.", author: "Jillian Michaels" },
  { text: "The key to successful leadership today is influence, not authority.", author: "Ken Blanchard" },
  { text: "Every person you meet is fighting a battle you know nothing about. Be kind.", author: "Robin Williams" },
];

function getDailyQuote() {
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  );
  return QUOTES[dayOfYear % QUOTES.length];
}

export function QuoteCard() {
  const [quote, setQuote] = useState({ text: '', author: '' });

  useEffect(() => {
    setQuote(getDailyQuote());
  }, []);

  if (!quote.text) return null;

  return (
    <div className="card bg-gradient-to-br from-brand-600 to-brand-800 text-white">
      <p className="text-base font-medium leading-relaxed italic">
        &ldquo;{quote.text}&rdquo;
      </p>
      <p className="text-sm text-brand-200 mt-2">
        &mdash; {quote.author}
      </p>
    </div>
  );
}
