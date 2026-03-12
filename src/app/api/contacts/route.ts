import { NextResponse } from 'next/server';
import { redis, keys } from '@/lib/redis';
import { Contact } from '@/lib/types';

// GET all contacts
export async function GET() {
  try {
    const contactIds = await redis.smembers(keys.contacts);
    if (!contactIds || contactIds.length === 0) {
      return NextResponse.json([]);
    }
    const pipeline = redis.pipeline();
    contactIds.forEach((id) => pipeline.get(keys.contact(id as string)));
    const results = await pipeline.exec();
    const contacts = results.filter(Boolean) as Contact[];
    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Failed to fetch contacts:', error);
    return NextResponse.json([], { status: 500 });
  }
}

// POST create or update a contact
export async function POST(request: Request) {
  try {
    const contact: Contact = await request.json();
    if (!contact.id) {
      contact.id = crypto.randomUUID();
      contact.createdAt = new Date().toISOString();
    }
    await redis.sadd(keys.contacts, contact.id);
    await redis.set(keys.contact(contact.id), JSON.stringify(contact));
    return NextResponse.json(contact);
  } catch (error) {
    console.error('Failed to save contact:', error);
    return NextResponse.json({ error: 'Failed to save' }, { status: 500 });
  }
}

// DELETE a contact
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await redis.srem(keys.contacts, id);
    await redis.del(keys.contact(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete contact:', error);
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 });
  }
}
