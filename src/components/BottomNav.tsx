'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { href: '/', label: 'Today', icon: '☀️' },
  { href: '/contacts', label: 'Contacts', icon: '👥' },
  { href: '/content', label: 'Content', icon: '✏️' },
  { href: '/progress', label: 'Progress', icon: '📊' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50"
         style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
      <div className="max-w-lg mx-auto flex justify-around items-center h-16">
        {tabs.map((tab) => {
          const isActive = tab.href === '/'
            ? pathname === '/'
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[4rem] py-1 transition-colors duration-150
                ${isActive
                  ? 'text-brand-600'
                  : 'text-gray-400 active:text-gray-600'
                }`}
            >
              <span className="text-xl leading-none" role="img" aria-label={tab.label}>
                {tab.icon}
              </span>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
              {isActive && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brand-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
