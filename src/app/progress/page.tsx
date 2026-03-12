import { WeeklyScorecard } from '@/components/progress/WeeklyScorecard';
import { OutreachHeatmap } from '@/components/progress/OutreachHeatmap';
import { CareerPathBreakdown } from '@/components/progress/CareerPathBreakdown';
import { BadgeRack } from '@/components/progress/BadgeRack';

export default function ProgressPage() {
  return (
    <div className="px-4 pt-12 pb-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
        <p className="text-sm text-gray-500 mt-1">Your momentum dashboard</p>
      </div>
      <WeeklyScorecard />
      <OutreachHeatmap />
      <CareerPathBreakdown />
      <BadgeRack />
    </div>
  );
}
