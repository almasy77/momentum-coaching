'use client';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getDateString(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export function GreetingCard() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        {getGreeting()}, Joe
      </h1>
      <p className="text-sm text-gray-500 mt-0.5">{getDateString()}</p>
    </div>
  );
}
