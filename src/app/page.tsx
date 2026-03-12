import { GreetingCard } from '@/components/today/GreetingCard';
import { QuoteCard } from '@/components/today/QuoteCard';
import { OutreachSummary } from '@/components/today/OutreachSummary';
import { QuickActions } from '@/components/today/QuickActions';

export default function TodayPage() {
  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <GreetingCard />
      <QuoteCard />
      <OutreachSummary />
      <QuickActions />
    </div>
  );
}
