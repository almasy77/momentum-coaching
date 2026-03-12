'use client';

import { useState } from 'react';

function ToggleRow({ label, description, enabled, onToggle }: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
          enabled ? 'bg-brand-600' : 'bg-gray-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            enabled ? 'translate-x-5' : ''
          }`}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const [goals, setGoals] = useState({
    outreach: 10,
    followups: 7,
    posts: 2,
    newContacts: 5,
  });

  const [notifications, setNotifications] = useState({
    morning: true,
    outreach: true,
    linkedin: true,
    evening: true,
    weekly: true,
  });

  const updateGoal = (key: string, delta: number) => {
    setGoals((prev) => ({
      ...prev,
      [key]: Math.max(1, (prev as Record<string, number>)[key] + delta),
    }));
  };

  const toggleNotif = (key: string) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !(prev as Record<string, boolean>)[key],
    }));
  };

  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Preferences &amp; goals</p>
      </div>

      {/* Profile */}
      <div className="card">
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">👤 Profile</h2>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
            JA
          </div>
          <div>
            <p className="font-semibold text-gray-900">Joe Adipietro</p>
            <p className="text-sm text-gray-500">SVP Corporate Strategy &amp; Transformation</p>
          </div>
        </div>
      </div>

      {/* Weekly Goals */}
      <div className="card">
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">🎯 Weekly Goals</h2>
        {[
          { key: 'outreach', label: 'Outreach target', emoji: '📞' },
          { key: 'followups', label: 'Follow-ups', emoji: '🔄' },
          { key: 'posts', label: 'LinkedIn posts', emoji: '📝' },
          { key: 'newContacts', label: 'New contacts', emoji: '🤝' },
        ].map((goal) => (
          <div key={goal.key} className="flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0">
            <div className="flex items-center gap-2">
              <span>{goal.emoji}</span>
              <span className="text-sm text-gray-700">{goal.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGoal(goal.key, -1)}
                className="w-7 h-7 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-sm font-bold active:bg-gray-200"
              >
                −
              </button>
              <span className="text-sm font-bold text-gray-900 w-5 text-center">
                {(goals as Record<string, number>)[goal.key]}
              </span>
              <button
                onClick={() => updateGoal(goal.key, 1)}
                className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-sm font-bold active:bg-brand-200"
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Notifications */}
      <div className="card">
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">🔔 Notifications</h2>
        <ToggleRow
          label="Morning motivation"
          description="Daily quote at 7:30 AM"
          enabled={notifications.morning}
          onToggle={() => toggleNotif('morning')}
        />
        <ToggleRow
          label="Outreach reminder"
          description="Follow-up nudge at 9:00 AM"
          enabled={notifications.outreach}
          onToggle={() => toggleNotif('outreach')}
        />
        <ToggleRow
          label="LinkedIn posting window"
          description="Tue/Thu at 11:00 AM"
          enabled={notifications.linkedin}
          onToggle={() => toggleNotif('linkedin')}
        />
        <ToggleRow
          label="Evening review"
          description="Daily summary at 6:00 PM"
          enabled={notifications.evening}
          onToggle={() => toggleNotif('evening')}
        />
        <ToggleRow
          label="Weekly summary"
          description="Sunday at 8:00 PM"
          enabled={notifications.weekly}
          onToggle={() => toggleNotif('weekly')}
        />
      </div>

      {/* Data */}
      <div className="card">
        <h2 className="text-xs font-semibold text-gray-400 uppercase mb-3">📊 Data</h2>
        <button className="w-full text-left text-sm text-brand-600 font-medium py-2.5 border-b border-gray-50">
          Export contacts (CSV)
        </button>
        <button className="w-full text-left text-sm text-brand-600 font-medium py-2.5">
          Export progress report
        </button>
      </div>

      {/* App info */}
      <p className="text-center text-xs text-gray-300 pt-2">
        Momentum v1.0 &middot; Built with ❤️ by Bryan
      </p>
    </div>
  );
}
