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
