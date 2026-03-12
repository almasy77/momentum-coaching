'use client';

import { Contact, CAREER_PATH_LABELS } from '@/lib/types';

function WarmthBadge({ warmth }: { warmth: Contact['warmth'] }) {
  const styles = {
    hot: 'badge-hot',
    warm: 'badge-warm',
    cool: 'badge-cool',
    cold: 'badge-cold',
  };

  return (
    <span className={`badge ${styles[warmth]}`}>
      {warmth.charAt(0).toUpperCase() + warmth.slice(1)}
    </span>
  );
}

function daysAgo(dateStr: string | null): string {
  if (!dateStr) return 'Never';
  const days = Math.floor(
    (Date.now() - new Date(dateStr).getTime()) / 86400000
  );
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return `${days}d ago`;
}

interface ContactCardProps {
  contact: Contact;
  onClick: (id: string) => void;
}

export function ContactCard({ contact, onClick }: ContactCardProps) {
  return (
    <button
      onClick={() => onClick(contact.id)}
      className="card w-full text-left active:scale-[0.99] transition-transform duration-100"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 truncate">
              {contact.name}
            </h3>
            <WarmthBadge warmth={contact.warmth} />
          </div>
          <p className="text-sm text-gray-600 truncate mt-0.5">
            {contact.title} &middot; {contact.organization}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {CAREER_PATH_LABELS[contact.careerPath]}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-xs text-gray-400">Last contact</p>
          <p className="text-sm font-medium text-gray-600">
            {daysAgo(contact.lastContacted)}
          </p>
          {contact.priority === 'high' && (
            <span className="text-xs text-red-500 font-medium">High priority</span>
          )}
        </div>
      </div>
    </button>
  );
}
