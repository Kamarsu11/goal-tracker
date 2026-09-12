import React from 'react';
import './chartConfig';
import { Chart } from 'react-chartjs-2';
import { DailySummary } from '../../types';
import { AlertTriangle, ShieldCheck, Maximize2 } from 'lucide-react';

interface UnnoticedTimeMonitorProps {
  summaries: DailySummary[];
  onOpenFullscreen?: () => void;
}

export const UnnoticedTimeMonitor: React.FC<UnnoticedTimeMonitorProps> = ({ summaries, onOpenFullscreen }) => {
  const labels = summaries.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
  });

  const unnoticedData = summaries.map(s => s.unnoticedHours);
  const thresholdData = summaries.map(() => 2.0); // 2.0h allowable healthy downtime

  const chartData: any = {
    labels,
    datasets: [
      {
        type: 'bar' as const,
        label: '🔴 Measured Unnoticed Dead Time',
        data: unnoticedData,
        backgroundColor: summaries.map(s =>
          s.unnoticedHours > 3.0 ? '#ef4444' : s.unnoticedHours > 1.5 ? '#f97316' : '#84cc16'
        ),
        borderRadius: 6,
      },
      {
        type: 'line' as const,
        label: 'Healthy Downtime Cap (2.0h/day)',
        data: thresholdData,
        borderColor: '#38bdf8',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#cbd5e1',
          font: { size: 10 },
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
        grid: { color: 'rgba(51, 65, 85, 0.2)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
      y: {
        title: {
          display: true,
          text: 'Hours / Day',
          color: '#94a3b8',
          font: { size: 10 },
        },
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
    },
  };

  const highDays = summaries.filter(s => s.unnoticedHours > 3.0).length;

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-red-500/20 text-red-400 rounded-lg">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              The "Silent Killer" Wastage Monitor
            </h3>
            <p className="text-[11px] text-slate-400">
              Daily unaccounted idle / dead time vs healthy recovery budget
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {highDays > 0 ? (
            <span className="text-xs bg-red-950/80 border border-red-800 text-red-400 px-2.5 py-1 rounded-lg font-semibold">
              {highDays} Days High Wastage (&gt;3h)
            </span>
          ) : (
            <span className="text-xs bg-emerald-950/80 border border-emerald-800 text-emerald-400 px-2.5 py-1 rounded-lg font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Well Controlled
            </span>
          )}

          {onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-900 border border-slate-700 hover:border-tennis-500/80 text-slate-300 hover:text-white rounded-xl text-xs font-semibold active:scale-95 transition-all shadow-sm"
              title="Fullscreen Interactive View"
            >
              <Maximize2 className="w-3.5 h-3.5 text-tennis-400" />
              <span>Fullscreen</span>
            </button>
          )}
        </div>
      </div>

      <div className="h-60 sm:h-64 w-full pt-1">
        <Chart type="bar" data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};
