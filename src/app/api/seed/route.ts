import { NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';
import { SAMPLE_CONTACTS } from '@/lib/data/sample-contacts';

// POST seed the database with contacts (wipes existing and reloads)
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const force = body?.force === true;

    // Check existing
    const existing = await redis.smembers(keys.contacts);

    if (existing && existing.length > 0 && !force) {
      return NextResponse.json({ message: 'Database already seeded', count: existing.length });
    }

    // Wipe existing contacts if force reseed
    if (existing && existing.length > 0) {
      const deletePipeline = redis.pipeline();
      for (const id of existing) {
        deletePipeline.del(keys.contact(id as string));
      }
      deletePipeline.del(keys.contacts);
      await deletePipeline.exec();
    }

    // Seed new contacts
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
