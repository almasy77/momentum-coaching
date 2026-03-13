import { NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';
import { SAMPLE_CONTACTS } from '@/lib/data/sample-contacts';
import { HISTORICAL_OUTREACH } from '@/lib/data/seed-outreach-history';

// POST seed the database with contacts and outreach history (wipes existing and reloads)
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
        // Also wipe per-contact outreach indices
        const outreachIds = await redis.smembers(keys.contactOutreach(id as string));
        if (outreachIds) {
          for (const oid of outreachIds) {
            deletePipeline.del(keys.outreachEntry(oid as string));
            deletePipeline.srem(keys.outreach, oid as string);
          }
          deletePipeline.del(keys.contactOutreach(id as string));
        }
      }
      deletePipeline.del(keys.contacts);
      await deletePipeline.exec();
    }

    // Seed contacts
    const contactPipeline = redis.pipeline();
    for (const contact of SAMPLE_CONTACTS) {
      contactPipeline.sadd(keys.contacts, contact.id);
      contactPipeline.set(keys.contact(contact.id), JSON.stringify(contact));
    }
    await contactPipeline.exec();

    // Seed historical outreach entries
    let outreachCount = 0;
    const outreachPipeline = redis.pipeline();
    for (const entry of HISTORICAL_OUTREACH) {
      const id = crypto.randomUUID();
      const full = { ...entry, id };
      outreachPipeline.set(keys.outreachEntry(id), JSON.stringify(full));
      outreachPipeline.sadd(keys.outreach, id);
      outreachPipeline.sadd(keys.contactOutreach(entry.contactId), id);
      outreachCount++;
    }
    await outreachPipeline.exec();

    return NextResponse.json({
      message: 'Seeded successfully',
      contacts: SAMPLE_CONTACTS.length,
      outreach: outreachCount,
    });
  } catch (error) {
    console.error('Failed to seed:', error);
    return NextResponse.json({ error: 'Failed to seed' }, { status: 500 });
  }
}
