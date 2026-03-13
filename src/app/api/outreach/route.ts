import { NextRequest, NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';
import { OutreachEntry } from '@/lib/types';

// GET outreach entries for a contact
export async function GET(request: NextRequest) {
  const contactId = request.nextUrl.searchParams.get('contactId');
  if (!contactId) {
    return NextResponse.json({ error: 'contactId required' }, { status: 400 });
  }

  try {
    const entryIds = await redis.smembers(keys.contactOutreach(contactId));
    if (!entryIds || entryIds.length === 0) {
      return NextResponse.json([]);
    }

    const pipeline = redis.pipeline();
    entryIds.forEach((id) => pipeline.get(keys.outreachEntry(id as string)));
    const results = await pipeline.exec();

    const entries = results
      .filter(Boolean)
      .map((e) => (typeof e === 'string' ? JSON.parse(e) : e) as OutreachEntry)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json(entries);
  } catch (error) {
    console.error('Failed to fetch outreach:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST create an outreach entry
export async function POST(request: Request) {
  try {
    const entry: OutreachEntry = await request.json();
    if (!entry.id) {
      entry.id = crypto.randomUUID();
    }

    // Save the entry
    await redis.set(keys.outreachEntry(entry.id), JSON.stringify(entry));

    // Add to the global outreach set
    await redis.sadd(keys.outreach, entry.id);

    // Add to the per-contact index
    if (entry.contactId) {
      await redis.sadd(keys.contactOutreach(entry.contactId), entry.id);
    }

    // Update the contact's lastContacted date
    if (entry.contactId && entry.date) {
      const raw = await redis.get(keys.contact(entry.contactId));
      if (raw) {
        const contact = typeof raw === 'string' ? JSON.parse(raw) : raw;
        // Only update if this outreach is more recent
        if (!contact.lastContacted || entry.date >= contact.lastContacted) {
          contact.lastContacted = entry.date;
          if (entry.followUpDate) {
            contact.nextFollowUp = entry.followUpDate;
          }
          await redis.set(keys.contact(entry.contactId), JSON.stringify(contact));
        }
      }
    }

    return NextResponse.json(entry);
  } catch (error) {
    console.error('Failed to save outreach:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// DELETE an outreach entry
export async function DELETE(request: Request) {
  try {
    const { id, contactId } = await request.json();
    await redis.del(keys.outreachEntry(id));
    await redis.srem(keys.outreach, id);
    if (contactId) {
      await redis.srem(keys.contactOutreach(contactId), id);
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete outreach:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
