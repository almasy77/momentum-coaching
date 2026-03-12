'use client';

import { useState, useCallback } from 'react';
import { PinLock } from './PinLock';

export function AuthWrapper({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);

  const handleUnlock = useCallback(() => {
    setUnlocked(true);
  }, []);

  if (!unlocked) {
    return <PinLock onUnlock={handleUnlock} />;
  }

  return <>{children}</>;
}
