'use client';

import Link from 'next/link';

const actions = [
  { href: '/contacts?action=log', label: 'Log Outreach', icon: '📞', color: 'bg-blue-50 text-blue-700' },
  { href: '/content?action=draft', label: 'Draft Post', icon: '✏️', color: 'bg-purple-50 text-purple-700' },
  { href: '/contacts?action=new', label: 'Add Contact', icon: '➕', color: 'bg-green-50 text-green-700' },
];

export function QuickActions() {
  return (
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide px-1">
        Quick Actions
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`card flex flex-col items-center gap-2 py-4 ${action.color} border-0 active:scale-[0.97] transition-transform`}
          >
            <span className="text-2xl">{action.icon}</span>
            <span className="text-xs font-semibold text-center leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
