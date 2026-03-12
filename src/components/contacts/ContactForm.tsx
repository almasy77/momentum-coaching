'use client';

import { useState } from 'react';
import { Contact, CareerPath, Warmth, Priority, ContactStatus, CAREER_PATH_LABELS } from '@/lib/types';

interface ContactFormProps {
  contact?: Contact;
  onSave: (contact: Omit<Contact, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
  onDelete?: () => void;
}

export function ContactForm({ contact, onSave, onCancel, onDelete }: ContactFormProps) {
  const [form, setForm] = useState({
    name: contact?.name ?? '',
    title: contact?.title ?? '',
    organization: contact?.organization ?? '',
    careerPath: contact?.careerPath ?? ('pe_operating' as CareerPath),
    networkSource: contact?.networkSource ?? '',
    warmth: contact?.warmth ?? ('cool' as Warmth),
    email: contact?.email ?? '',
    phone: contact?.phone ?? '',
    linkedinUrl: contact?.linkedinUrl ?? '',
    lastContacted: contact?.lastContacted ?? '',
    nextFollowUp: contact?.nextFollowUp ?? '',
    priority: contact?.priority ?? ('medium' as Priority),
    status: contact?.status ?? ('not_started' as ContactStatus),
    notes: contact?.notes ?? '',
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...form,
      lastContacted: form.lastContacted || null,
      nextFollowUp: form.nextFollowUp || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-bold text-gray-900">
          {contact ? 'Edit Contact' : 'New Contact'}
        </h2>
        <button type="button" onClick={onCancel} className="text-sm text-gray-500">
          Cancel
        </button>
      </div>

      {/* Name & Title */}
      <div className="card space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Name *</span>
          <input
            required
            type="text"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="Full name"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Title / Role</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. Managing Director"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Organization</span>
          <input
            type="text"
            value={form.organization}
            onChange={(e) => update('organization', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. Blackstone"
          />
        </label>
      </div>

      {/* Classification */}
      <div className="card space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Career Path</span>
          <select
            value={form.careerPath}
            onChange={(e) => update('careerPath', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            {Object.entries(CAREER_PATH_LABELS).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Warmth</span>
            <select
              value={form.warmth}
              onChange={(e) => update('warmth', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="hot">🔴 Hot</option>
              <option value="warm">🟠 Warm</option>
              <option value="cool">🔵 Cool</option>
              <option value="cold">⚪ Cold</option>
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Priority</span>
            <select
              value={form.priority}
              onChange={(e) => update('priority', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </label>
        </div>

        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Status</span>
          <select
            value={form.status}
            onChange={(e) => update('status', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <option value="not_started">Not Started</option>
            <option value="in_progress">In Progress</option>
            <option value="active">Active</option>
            <option value="on_hold">On Hold</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Network Source</span>
          <input
            type="text"
            value={form.networkSource}
            onChange={(e) => update('networkSource', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            placeholder="e.g. BCG Alumni, Wharton"
          />
        </label>
      </div>

      {/* Contact Info */}
      <div className="card space-y-3">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Phone</span>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update('phone', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">LinkedIn URL</span>
          <input
            type="url"
            value={form.linkedinUrl}
            onChange={(e) => update('linkedinUrl', e.target.value)}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </label>
      </div>

      {/* Dates */}
      <div className="card space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Last Contacted</span>
            <input
              type="date"
              value={form.lastContacted}
              onChange={(e) => update('lastContacted', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
          <label className="block">
            <span className="text-xs font-medium text-gray-500 uppercase">Next Follow-up</span>
            <input
              type="date"
              value={form.nextFollowUp}
              onChange={(e) => update('nextFollowUp', e.target.value)}
              className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </label>
        </div>
      </div>

      {/* Notes */}
      <div className="card">
        <label className="block">
          <span className="text-xs font-medium text-gray-500 uppercase">Notes</span>
          <textarea
            value={form.notes}
            onChange={(e) => update('notes', e.target.value)}
            rows={3}
            className="mt-1 w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            placeholder="Context, talking points, action items..."
          />
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button type="submit" className="btn-primary flex-1">
          {contact ? 'Save Changes' : 'Add Contact'}
        </button>
      </div>

      {contact && onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="w-full text-sm text-red-500 py-2 active:text-red-700"
        >
          Delete Contact
        </button>
      )}
    </form>
  );
}
