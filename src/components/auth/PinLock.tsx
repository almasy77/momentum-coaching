'use client';

import { useState, useEffect, useRef } from 'react';

export function PinLock({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  // Check existing session on mount
  useEffect(() => {
    fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          onUnlock();
        } else {
          setChecking(false);
        }
      })
      .catch(() => setChecking(false));
  }, [onUnlock]);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const newPin = pin + digit;
    setPin(newPin);
    setError('');

    if (newPin.length === 4) {
      verify(newPin);
    }
  };

  const handleDelete = () => {
    setPin((prev) => prev.slice(0, -1));
    setError('');
  };

  const verify = async (code: string) => {
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', pin: code }),
      });
      const data = await res.json();
      if (data.success) {
        onUnlock();
      } else {
        setError('Wrong PIN');
        setPin('');
        // Shake animation via CSS
      }
    } catch {
      setError('Connection error');
      setPin('');
    }
  };

  if (checking) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-brand-800 to-brand-950 z-50 flex flex-col items-center justify-center px-8">
      {/* Logo */}
      <div className="mb-8 text-center">
        <div className="text-4xl mb-2">🚀</div>
        <h1 className="text-xl font-bold text-white">Momentum</h1>
        <p className="text-brand-300 text-sm mt-1">Enter your PIN</p>
      </div>

      {/* PIN dots */}
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`w-4 h-4 rounded-full transition-all duration-200 ${
              i < pin.length
                ? 'bg-white scale-110'
                : 'bg-brand-600 border-2 border-brand-400'
            }`}
          />
        ))}
      </div>

      {/* Error */}
      {error && (
        <p className="text-red-300 text-sm mb-4 animate-pulse">{error}</p>
      )}

      {/* Number pad */}
      <div className="grid grid-cols-3 gap-4 w-64">
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', '←'].map(
          (key) => {
            if (key === '') return <div key="empty" />;
            if (key === '←') {
              return (
                <button
                  key="delete"
                  onClick={handleDelete}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl text-brand-300 active:bg-brand-700/50 mx-auto"
                >
                  ←
                </button>
              );
            }
            return (
              <button
                key={key}
                onClick={() => handleDigit(key)}
                className="w-16 h-16 rounded-full bg-brand-700/30 backdrop-blur flex items-center justify-center text-2xl font-medium text-white active:bg-brand-600/50 transition-colors mx-auto"
              >
                {key}
              </button>
            );
          }
        )}
      </div>

      {/* Hidden input for keyboard support */}
      <input
        ref={inputRef}
        type="tel"
        maxLength={4}
        className="opacity-0 absolute"
        value={pin}
        onChange={(e) => {
          const val = e.target.value.replace(/\D/g, '').slice(0, 4);
          setPin(val);
          if (val.length === 4) verify(val);
        }}
        autoFocus
      />
    </div>
  );
}
