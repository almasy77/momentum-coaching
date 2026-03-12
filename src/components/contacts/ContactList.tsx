'use client';

import { useState, useMemo } from 'react';
import { Contact, Warmth, CareerPath, CAREER_PATH_LABELS, WARMTH_LABELS } from '@/lib/types';
import { ContactCard } from './ContactCard';

interface ContactListProps {
  contacts: Contact[];
  onSelect: (id: string) => void;
  onAdd: () => void;
}

type FilterType = 'all' | Warmth;
type SortType = 'name' | 'lastContacted' | 'priority';

export function ContactList({ contacts, onSelect, onAdd }: ContactListProps) {
  const [search, setSearch] = useState('');
  const [warmthFilter, setWarmthFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('lastContacted');

  const filtered = useMemo(() => {
    let result = contacts;

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.organization.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q)
      );
    }

    if (warmthFilter !== 'all') {
      result = result.filter((c) => c.warmth === warmthFilter);
    }

    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'priority') {
        const order = { high: 0, medium: 1, low: 2 };
        return order[a.priority] - order[b.priority];
      }
      // lastContacted — most recent first, null last
      const aDate = a.lastContacted ? new Date(a.lastContacted).getTime() : 0;
      const bDate = b.lastContacted ? new Date(b.lastContacted).getTime() : 0;
      return bDate - aDate;
    });

    return result;
  }, [contacts, search, warmthFilter, sortBy]);

  const warmthFilters: { value: FilterType; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'hot', label: '🔴 Hot' },
    { value: 'warm', label: '🟠 Warm' },
    { value: 'cool', label: '🔵 Cool' },
    { value: 'cold', label: '⚪ Cold' },
  ];

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search contacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 pl-10 text-sm
                     focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* Filters row */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {warmthFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => setWarmthFilter(f.value)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors
              ${warmthFilter === f.value
                ? 'bg-brand-600 text-white'
                : 'bg-gray-100 text-gray-600 active:bg-gray-200'
              }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Results count + sort */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {filtered.length} contact{filtered.length !== 1 ? 's' : ''}
        </span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortType)}
          className="text-xs text-gray-500 bg-transparent border-none focus:outline-none"
        >
          <option value="lastContacted">Last contacted</option>
          <option value="priority">Priority</option>
          <option value="name">Name</option>
        </select>
      </div>

      {/* Contact cards */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="card text-center text-gray-400 py-8">
            {search ? 'No contacts match your search' : 'No contacts yet'}
          </div>
        ) : (
          filtered.map((contact) => (
            <ContactCard key={contact.id} contact={contact} onClick={onSelect} />
          ))
        )}
      </div>

      {/* FAB - Add contact */}
      <button
        onClick={onAdd}
        className="fixed bottom-20 right-4 w-14 h-14 bg-brand-600 text-white rounded-full
                   shadow-lg flex items-center justify-center text-2xl
                   active:scale-95 transition-transform z-40"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        +
      </button>
    </div>
  );
}
