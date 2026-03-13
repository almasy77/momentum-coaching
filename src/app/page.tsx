import { GreetingCard } from '@/components/today/GreetingCard';
import { QuoteCard } from '@/components/today/QuoteCard';
import { FollowUpAlerts } from '@/components/today/FollowUpAlerts';
import { WeeklyGoal } from '@/components/today/WeeklyGoal';
import { QuickActions } from '@/components/today/QuickActions';

export default function TodayPage() {
  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <GreetingCard />
      <FollowUpAlerts />
      <WeeklyGoal />
      <QuickActions />
      <QuoteCard />
    </div>
  );
}
