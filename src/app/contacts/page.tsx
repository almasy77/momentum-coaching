'use client';

import { useState } from 'react';
import { Contact } from '@/lib/types';
import { SAMPLE_CONTACTS } from '@/lib/data/sample-contacts';
import { ContactList } from '@/components/contacts/ContactList';
import { ContactDetail } from '@/components/contacts/ContactDetail';
import { ContactForm } from '@/components/contacts/ContactForm';

type View = 'list' | 'detail' | 'add' | 'edit';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>(SAMPLE_CONTACTS);
  const [view, setView] = useState<View>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedContact = contacts.find((c) => c.id === selectedId) ?? null;

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setView('detail');
  };

  const handleAdd = () => {
    setSelectedId(null);
    setView('add');
  };

  const handleSave = (data: Omit<Contact, 'id' | 'createdAt'>) => {
    if (view === 'edit' && selectedContact) {
      setContacts((prev) =>
        prev.map((c) =>
          c.id === selectedContact.id
            ? { ...c, ...data }
            : c
        )
      );
      setView('detail');
    } else {
      const newContact: Contact = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString().split('T')[0],
      };
      setContacts((prev) => [newContact, ...prev]);
      setSelectedId(newContact.id);
      setView('detail');
    }
  };

  const handleDelete = () => {
    if (selectedId) {
      setContacts((prev) => prev.filter((c) => c.id !== selectedId));
      setSelectedId(null);
      setView('list');
    }
  };

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
            // TODO: open outreach log form
          }}
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
