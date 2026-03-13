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
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">This Week</h2>
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
