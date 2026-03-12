import { NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';

const DEFAULT_SETTINGS = {
  goals: { outreach: 10, followups: 7, posts: 2, newContacts: 5 },
  notifications: {
    morning: true,
    outreach: true,
    linkedin: true,
    evening: true,
    weekly: true,
  },
};

// GET settings
export async function GET() {
  try {
    const settings = await redis.get(keys.settings);
    if (!settings) {
      return NextResponse.json(DEFAULT_SETTINGS);
    }
    return NextResponse.json(typeof settings === 'string' ? JSON.parse(settings) : settings);
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return NextResponse.json(DEFAULT_SETTINGS, { status: 500 });
  }
}

// POST update settings
export async function POST(request: Request) {
  try {
    const settings = await request.json();
    await redis.set(keys.settings, JSON.stringify(settings));
    return NextResponse.json(settings);
  } catch (error) {
    console.error('Failed to save settings:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}
