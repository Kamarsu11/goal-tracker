import React from 'react';
import './chartConfig';
import { Bar } from 'react-chartjs-2';
import { DailySummary, ChildProfile } from '../../types';
import { Target } from 'lucide-react';

interface TargetVsActualBarChartProps {
  summaries: DailySummary[];
  profile: ChildProfile;
}

export const TargetVsActualBarChart: React.FC<TargetVsActualBarChartProps> = ({
  summaries,
  profile,
}) => {
  const totalDays = summaries.length || 1;

  // Actual totals
  const actualTennis = summaries.reduce((a, b) => a + b.tennisHours, 0);
  const actualMulti = summaries.reduce((a, b) => a + b.multisportHours, 0);
  const actualMobility = summaries.reduce((a, b) => a + b.mobilityHours, 0);
  const actualSleep = summaries.reduce((a, b) => a + b.sleepHours, 0);
  const actualUnnoticed = summaries.reduce((a, b) => a + b.unnoticedHours, 0);

  // Ideal targets sum
  const idealTennis = summaries.reduce((a, b) => a + b.idealTennisTarget, 0);
  const idealMulti = summaries.reduce((a, b) => a + b.idealMultisportTarget, 0);
  const idealMobility = totalDays * 0.5; // ~0.5h/day
  const idealSleep = summaries.reduce((a, b) => a + b.idealSleepTarget, 0);
  const idealUnnoticed = totalDays * 1.5; // max allowable leisure threshold

  const categories = ['Tennis', 'Multisport', 'Mobility & Prehab', 'Sleep', 'Unnoticed Dead Time'];

  const chartData = {
    labels: categories,
    datasets: [
      {
        label: 'Actual Logged Hours',
        data: [
          parseFloat(actualTennis.toFixed(1)),
          parseFloat(actualMulti.toFixed(1)),
          parseFloat(actualMobility.toFixed(1)),
          parseFloat(actualSleep.toFixed(1)),
          parseFloat(actualUnnoticed.toFixed(1)),
        ],
        backgroundColor: [
          '#84cc16', // lime
          '#6366f1', // indigo
          '#ec4899', // pink
          '#3b82f6', // blue
          '#ef4444', // red
        ],
        borderRadius: 6,
      },
      {
        label: 'Ideal Pro Benchmark Target',
        data: [
          parseFloat(idealTennis.toFixed(1)),
          parseFloat(idealMulti.toFixed(1)),
          parseFloat(idealMobility.toFixed(1)),
          parseFloat(idealSleep.toFixed(1)),
          parseFloat(idealUnnoticed.toFixed(1)),
        ],
        backgroundColor: 'rgba(56, 189, 248, 0.4)',
        borderColor: '#38bdf8',
        borderWidth: 1.5,
        borderRadius: 6,
      },
    ],
  };

  const chartOptions: any = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 11, weight: 'bold' },
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: ${context.raw} hrs`,
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
      y: {
        grid: { display: false },
        ticks: { color: '#e2e8f0', font: { size: 11, weight: '600' } },
      },
    },
  };

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center gap-2">
        <div className="p-1.5 bg-tennis-500/20 text-tennis-400 rounded-lg">
          <Target className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-100">
            Target vs Actual Comparison (Total Period)
          </h3>
          <p className="text-[11px] text-slate-400">
            Comparing logged total hours against dynamic pro benchmark targets
          </p>
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full pt-1">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
