'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Contact } from '@/lib/types';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactDetail } from '@/components/contacts/ContactDetail';
import { ContactForm } from '@/components/contacts/ContactForm';

type View = 'list' | 'detail' | 'add' | 'edit';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;

  const fetchContacts = useCallback(async () => {
    try {
      const res = await fetch('/api/contacts');
      const data = await res.json();
      const parsed = data.map((c: Contact | string) =>
        typeof c === 'string' ? JSON.parse(c) : c
      );
      setContacts(parsed);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContacts();
  }, [fetchContacts]);

  // Handle query param actions from dashboard
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new' || action === 'add') {
      setView('add');
    }
    // 'log' action just shows the contact list — user picks a contact, then logs
  }, [searchParams]);

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView('detail');
  };

  const handleAdd = () => {
    setSelectedId(null);
    setView('add');
  };

  const handleSave = async (data: Omit<Contact, 'id' | 'createdAt'>) => {
    const contact: Contact =
      view === 'edit' && selectedContact
        ? { ...selectedContact, ...data }
        : {
            ...data,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString().split('T')[0],
          };

    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });
      await fetchContacts();
      setSelectedId(contact.id);
      setView(view === 'edit' ? 'detail' : 'detail');
    } catch (err) {
      console.error('Failed to save contact:', err);
    }
  };

  const handleDelete = async () => {
    if (selectedId) {
      try {
        await fetch('/api/contacts', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedId }),
        });
        await fetchContacts();
        setSelectedId(null);
        setView('list');
      } catch (err) {
        console.error('Failed to delete contact:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="px-4 pt-12 pb-6 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">Loading contacts…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 pt-12 pb-6">
      {view === 'list' && (
        <>
          <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
          <p className="text-sm text-gray-500 mt-1 mb-4">
            {contacts.length} in your network
          </p>
          <ContactList
            contacts={contacts}
            onSelect={handleSelect}
            onAdd={handleAdd}
          />
        </>
      )}

      {view === 'detail' && selectedContact && (
        <ContactDetail
          contact={selectedContact}
          onEdit={() => setView('edit')}
          onBack={() => setView('list')}
          onLogOutreach={() => {
            // Log form is now handled inside ContactDetail
          }}
          onContactUpdated={fetchContacts}
        />
      )}

      {(view === 'add' || view === 'edit') && (
        <ContactForm
          contact={view === 'edit' ? selectedContact ?? undefined : undefined}
          onSave={handleSave}
          onCancel={() => setView(selectedId ? 'detail' : 'list')}
          onDelete={view === 'edit' ? handleDelete : undefined}
        />
      )}
    </div>
  );
}
