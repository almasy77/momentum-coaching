'use client';

import { Contact, CAREER_PATH_LABELS } from '@/lib/types';

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  if (!value) return null;
  return (
    <div className="flex justify-between items-start py-2 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-400 uppercase shrink-0 w-28">{label}</span>
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer"
           className="text-sm text-brand-600 text-right truncate">
          {value}
        </a>
      ) : (
        <span className="text-sm text-gray-700 text-right">{value}</span>
      )}
    </div>
  );
}

function WarmthIndicator({ warmth }: { warmth: Contact['warmth'] }) {
  const colors = {
    hot: 'bg-red-500',
    warm: 'bg-orange-500',
    cool: 'bg-blue-500',
    cold: 'bg-gray-400',
  };

  return (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${colors[warmth]}`} />
      <span className="text-sm font-medium capitalize">{warmth}</span>
    </div>
  );
}

interface ContactDetailProps {
  contact: Contact;
  onEdit: () => void;
  onBack: () => void;
  onLogOutreach: () => void;
}

export function ContactDetail({ contact, onEdit, onBack, onLogOutreach }: ContactDetailProps) {
  const formatDate = (d: string | null) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button onClick={onBack} className="text-sm text-brand-600 font-medium">
          ← Back
        </button>
        <button onClick={onEdit} className="text-sm text-brand-600 font-medium">
          Edit
        </button>
      </div>

      {/* Name card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{contact.name}</h2>
            <p className="text-sm text-gray-600 mt-0.5">
              {contact.title} &middot; {contact.organization}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {CAREER_PATH_LABELS[contact.careerPath]}
            </p>
          </div>
          <WarmthIndicator warmth={contact.warmth} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-3 gap-2">
        {contact.phone && (
          <a href={`tel:${contact.phone}`}
             className="card flex flex-col items-center gap-1 py-3 bg-green-50 border-0">
            <span className="text-lg">📞</span>
            <span className="text-xs font-medium text-green-700">Call</span>
          </a>
        )}
        {contact.email && (
          <a href={`mailto:${contact.email}`}
             className="card flex flex-col items-center gap-1 py-3 bg-blue-50 border-0">
            <span className="text-lg">✉️</span>
            <span className="text-xs font-medium text-blue-700">Email</span>
          </a>
        )}
        {contact.linkedinUrl && (
          <a href={contact.linkedinUrl} target="_blank" rel="noopener noreferrer"
             className="card flex flex-col items-center gap-1 py-3 bg-sky-50 border-0">
            <span className="text-lg">💼</span>
            <span className="text-xs font-medium text-sky-700">LinkedIn</span>
          </a>
        )}
      </div>

      {/* Details */}
      <div className="card">
        <InfoRow label="Priority" value={contact.priority.charAt(0).toUpperCase() + contact.priority.slice(1)} />
        <InfoRow label="Status" value={contact.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} />
        <InfoRow label="Source" value={contact.networkSource} />
        <InfoRow label="Last Contact" value={formatDate(contact.lastContacted)} />
        <InfoRow label="Next Follow-up" value={formatDate(contact.nextFollowUp)} />
        <InfoRow label="Email" value={contact.email} href={`mailto:${contact.email}`} />
        <InfoRow label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
      </div>

      {/* Notes */}
      {contact.notes && (
        <div className="card">
          <h3 className="text-xs font-medium text-gray-400 uppercase mb-2">Notes</h3>
          <p className="text-sm text-gray-700 leading-relaxed">{contact.notes}</p>
        </div>
      )}

      {/* Log outreach button */}
      <button onClick={onLogOutreach} className="btn-primary w-full">
        📞 Log Outreach
      </button>
    </div>
  );
}
