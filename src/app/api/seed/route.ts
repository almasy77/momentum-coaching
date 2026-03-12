import { NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';
import { SAMPLE_CONTACTS } from '@/lib/data/sample-contacts';

// POST seed the database with sample contacts
export async function POST() {
  try {
    const existing = await redis.smembers(keys.contacts);
    if (existing && existing.length > 0) {
      return NextResponse.json({ message: 'Database already seeded', count: existing.length });
    }
    const pipeline = redis.pipeline();
    for (const contact of SAMPLE_CONTACTS) {
      pipeline.sadd(keys.contacts, contact.id);
      pipeline.set(keys.contact(contact.id), JSON.stringify(contact));
    }
    await pipeline.exec();
    return NextResponse.json({ message: 'Seeded successfully', count: SAMPLE_CONTACTS.length });
  } catch (error) {
    console.error('Failed to seed:', error);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
