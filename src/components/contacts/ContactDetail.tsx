'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Contact, OutreachEntry, CAREER_PATH_LABELS } from '@/lib/types';
import { OutreachLogForm } from './OutreachLogForm';
import { OutreachTimeline } from './OutreachTimeline';

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
  onContactUpdated?: () => void;
}

export function ContactDetail({ contact, onEdit, onBack, onLogOutreach, onContactUpdated }: ContactDetailProps) {
  const [showLogForm, setShowLogForm] = useState(false);
  const [outreachEntries, setOutreachEntries] = useState<OutreachEntry[]>([]);
  const [loadingOutreach, setLoadingOutreach] = useState(true);

  // Editable notes state
  const [editingNotes, setEditingNotes] = useState(false);
  const [notes, setNotes] = useState(contact.notes || '');
  const [savingNotes, setSavingNotes] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const fetchOutreach = useCallback(async () => {
    try {
      const res = await fetch(`/api/outreach?contactId=${contact.id}`);
      const data = await res.json();
      setOutreachEntries(data);
    } catch (err) {
      console.error('Failed to load outreach:', err);
    } finally {
      setLoadingOutreach(false);
    }
  }, [contact.id]);

  useEffect(() => {
    fetchOutreach();
  }, [fetchOutreach]);

  // Sync notes when contact prop changes
  useEffect(() => {
    setNotes(contact.notes || '');
  }, [contact.notes]);

  const formatDate = (d: string | null) => {
    if (!d) return '—';
    // Append T00:00:00 to date-only strings so they parse as local time, not UTC
    const iso = d.includes('T') ? d : `${d}T00:00:00`;
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    try {
      await fetch('/api/contacts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...contact, notes }),
      });
      setEditingNotes(false);
      onContactUpdated?.();
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleNotesBlur = () => {
    if (notes !== (contact.notes || '')) {
      handleSaveNotes();
    } else {
      setEditingNotes(false);
    }
  };

  const handleLogSave = async (entry: Omit<OutreachEntry, 'id'>) => {
    try {
      await fetch('/api/outreach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...entry, id: crypto.randomUUID() }),
      });
      setShowLogForm(false);
      await fetchOutreach();
      onContactUpdated?.();
    } catch (err) {
      console.error('Failed to log outreach:', err);
    }
  };

  const startEditNotes = () => {
    setEditingNotes(true);
    setTimeout(() => textareaRef.current?.focus(), 50);
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

      {/* Notes — tap to edit */}
      <div className="card cursor-pointer" onClick={!editingNotes ? startEditNotes : undefined}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-medium text-gray-400 uppercase">Notes</h3>
          {!editingNotes && (
            <span className="text-xs text-brand-600">tap to edit</span>
          )}
          {savingNotes && (
            <span className="text-xs text-gray-400">saving...</span>
          )}
        </div>
        {editingNotes ? (
          <textarea
            ref={textareaRef}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleNotesBlur}
            rows={4}
            className="w-full text-sm text-gray-700 leading-relaxed border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            placeholder="Add notes, context, talking points..."
          />
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed min-h-[2rem]">
            {notes || <span className="text-gray-400 italic">No notes yet — tap to add</span>}
          </p>
        )}
      </div>

      {/* Outreach Timeline */}
      {loadingOutreach ? (
        <div className="card text-center py-4">
          <div className="w-5 h-5 border-2 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      ) : (
        <OutreachTimeline entries={outreachEntries} />
      )}

      {/* Log outreach button */}
      <button onClick={() => setShowLogForm(true)} className="btn-primary w-full">
        📞 Log Outreach
      </button>

      {/* Log form sheet */}
      {showLogForm && (
        <OutreachLogForm
          contactId={contact.id}
          contactName={contact.name}
          onSave={handleLogSave}
          onCancel={() => setShowLogForm(false)}
        />
      )}
    </div>
  );
}
