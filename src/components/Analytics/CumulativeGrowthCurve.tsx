import React, { useRef, useState } from 'react';
import './chartConfig';
import { Line } from 'react-chartjs-2';
import { DailySummary, ChildProfile } from '../../types';
import { Maximize2, RotateCcw, TrendingUp, Info, Calendar } from 'lucide-react';

interface CumulativeGrowthCurveProps {
  k1Summaries: DailySummary[];
  k2Summaries?: DailySummary[];
  profile1: ChildProfile;
  profile2?: ChildProfile;
  showBothKids?: boolean;
  onOpenFullscreen?: () => void;
}

export const CumulativeGrowthCurve: React.FC<CumulativeGrowthCurveProps> = ({
  k1Summaries,
  k2Summaries = [],
  profile1,
  profile2,
  showBothKids = false,
  onOpenFullscreen,
}) => {
  const chartRef = useRef<any>(null);
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() =>
    k1Summaries.length > 0 ? k1Summaries.length - 1 : 0
  );

  // Build cumulative datasets
  const labels = k1Summaries.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  });

  // Calculate cumulative scores
  let cumIdeal = 0;
  const idealData = k1Summaries.map(s => {
    if (s.status === 'unlogged') {
      return cumIdeal; // Don't accumulate on unconfirmed days
    }
    cumIdeal += s.idealScoreTarget;
    return parseFloat(cumIdeal.toFixed(1));
  });

  let cumK1 = 0;
  const k1Data = k1Summaries.map(s => {
    if (s.status === 'unlogged') {
      return cumK1; // Don't accumulate on unconfirmed days
    }
    cumK1 += s.effectiveTennisScore;
    return parseFloat(cumK1.toFixed(1));
  });

  let cumK2 = 0;
  const k2Data = k2Summaries.map(s => {
    if (s.status === 'unlogged') {
      return cumK2; // Don't accumulate on unconfirmed days
    }
    cumK2 += s.effectiveTennisScore;
    return parseFloat(cumK2.toFixed(1));
  });

  const datasets: any[] = [
    {
      label: '⭐ Ideal Pro Target Benchmark',
      data: idealData,
      borderColor: '#38bdf8', // Sky blue
      backgroundColor: 'rgba(56, 189, 248, 0.08)',
      borderWidth: 3,
      borderDash: [6, 4],
      pointRadius: k1Summaries.length > 60 ? 0 : 4,
      pointHoverRadius: 7,
      fill: true,
      tension: 0.3,
    },
    {
      label: `🎾 ${profile1.name} (Actual)`,
      data: k1Data,
      borderColor: '#ccff00', // Neon tennis lime
      backgroundColor: 'rgba(204, 255, 0, 0.15)',
      borderWidth: 3.5,
      pointRadius: k1Summaries.length > 60 ? 0 : 5,
      pointBackgroundColor: '#ccff00',
      pointHoverRadius: 8,
      fill: false,
      tension: 0.2,
    },
  ];

  if (showBothKids && profile2 && k2Summaries.length > 0) {
    datasets.push({
      label: `🎾 ${profile2.name} (Actual)`,
      data: k2Data,
      borderColor: '#06b6d4', // Cyan
      backgroundColor: 'rgba(6, 182, 212, 0.1)',
      borderWidth: 3,
      pointRadius: k1Summaries.length > 60 ? 0 : 5,
      pointBackgroundColor: '#06b6d4',
      pointHoverRadius: 8,
      fill: false,
      tension: 0.2,
    });
  }

  const chartData = {
    labels,
    datasets,
  };

  const chartOptions: any = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    onClick: (_event: any, elements: any[]) => {
      if (elements && elements.length > 0) {
        const index = elements[0].index;
        setSelectedDayIndex(index);
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#e2e8f0',
          font: { size: 11, weight: 'bold' },
          boxWidth: 14,
          padding: 12,
        },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        borderColor: '#334155',
        borderWidth: 1,
        titleColor: '#f8fafc',
        bodyColor: '#e2e8f0',
        padding: 10,
        callbacks: {
          afterTitle: (context: any) => {
            const index = context[0]?.dataIndex;
            if (index !== undefined && index !== selectedDayIndex) {
              // Update mobile inspection on hover/tap
              setTimeout(() => setSelectedDayIndex(index), 0);
            }
            return '';
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(51, 65, 85, 0.3)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
          maxTicksLimit: 12, // Prevents year-long clutter
        },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Athletic Score',
          color: '#94a3b8',
          font: { size: 11 },
        },
        grid: {
          color: 'rgba(51, 65, 85, 0.4)',
        },
        ticks: {
          color: '#94a3b8',
          font: { size: 10 },
        },
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) {
      chartRef.current.resetZoom();
    }
  };

  // Quick range window jump on long ranges (e.g. 1 year)
  const handleZoomPreset = (daysCount: number) => {
    if (!chartRef.current) return;
    const chart = chartRef.current;
    if (daysCount === 0) {
      chart.resetZoom();
      return;
    }
    const total = k1Summaries.length;
    const minIndex = Math.max(0, total - daysCount);
    chart.zoomScale('x', { min: minIndex, max: total - 1 }, 'default');
  };

  const selectedSummary = k1Summaries[selectedDayIndex] || k1Summaries[k1Summaries.length - 1];
  const selectedK2Summary = k2Summaries[selectedDayIndex];
  const formattedSelectedDate = selectedSummary
    ? new Date(selectedSummary.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : '';

  return (
    <div className="bg-brand-card border border-brand-border rounded-2xl p-4 shadow-xl space-y-3">
      {/* Header with zoom reset and fullscreen */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-tennis-500/20 text-tennis-400 rounded-lg">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Cumulative Growth Trajectory
            </h3>
            <p className="text-[11px] text-slate-400">
              Tap any point on chart to inspect exact breakdown
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {k1Summaries.length > 30 && (
            <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800 text-[10px]">
              <span className="text-slate-400">View:</span>
              <button
                onClick={() => handleZoomPreset(14)}
                className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold"
              >
                14D
              </button>
              <button
                onClick={() => handleZoomPreset(30)}
                className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold"
              >
                30D
              </button>
              <button
                onClick={() => handleZoomPreset(90)}
                className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold"
              >
                90D
              </button>
              <button
                onClick={() => handleZoomPreset(0)}
                className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold"
              >
                All
              </button>
            </div>
          )}

          <button
            onClick={handleResetZoom}
            className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg text-xs font-medium active:scale-95 transition-all"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3 h-3" /> Reset
          </button>

          {onOpenFullscreen && (
            <button
              onClick={onOpenFullscreen}
              className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 rounded-lg active:scale-95 transition-all"
              title="Fullscreen Chart"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Chart container */}
      <div className="h-64 sm:h-72 w-full pt-1">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      {/* Interactive Day Inspector Card (Works 100% on iOS Touch & Desktop) */}
      {selectedSummary && (
        <div className="p-3.5 bg-slate-900/90 rounded-xl border border-brand-border text-xs space-y-2.5 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-tennis-400" />
              <span className="font-bold text-slate-100">{formattedSelectedDate}</span>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded capitalize">
                {selectedSummary.status}
              </span>
            </div>
            <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 flex-wrap">
              <span>{profile1.name}: <strong className="text-tennis-400 font-bold">{k1Data[selectedDayIndex]} pts</strong></span>
              {showBothKids && profile2 && selectedK2Summary && (
                <span>• {profile2.name}: <strong className="text-cyan-400 font-bold">{k2Data[selectedDayIndex]} pts</strong></span>
              )}
              <span>• Ideal: <strong className="text-sky-400 font-bold">{idealData[selectedDayIndex]} pts</strong></span>
            </div>
          </div>

          <div className={`grid grid-cols-1 ${showBothKids && profile2 && selectedK2Summary ? 'md:grid-cols-3' : 'sm:grid-cols-2'} gap-3 text-[11px]`}>
            {/* Kid 1 Daily Contribution */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-lime-500/30">
              <div className="flex items-center justify-between font-bold text-tennis-400">
                <span>🎾 {profile1.name} (+{selectedSummary.effectiveTennisScore.toFixed(2)} pts)</span>
              </div>
              <div className="text-slate-300 space-y-0.5 text-[10px]">
                <div>• Tennis Logged: <strong>{selectedSummary.tennisHours.toFixed(2)}h</strong></div>
                <div>• Multisport: <strong>{selectedSummary.multisportHours.toFixed(2)}h</strong></div>
                <div>• Mobility / Prehab: <strong>{selectedSummary.mobilityHours.toFixed(2)}h</strong></div>
                <div>• Sleep: <strong>{selectedSummary.sleepHours.toFixed(2)}h</strong> • School: <strong>{selectedSummary.schoolHours.toFixed(2)}h</strong></div>
                {selectedSummary.unnoticedHours > 0 && (
                  <div className="text-red-400">• Unnoticed Dead Time: <strong>{selectedSummary.unnoticedHours.toFixed(2)}h</strong></div>
                )}
                <div className="text-tennis-300 font-mono pt-1 border-t border-slate-800 text-[9.5px]">
                  Calculation: ({selectedSummary.tennisHours.toFixed(2)} × 1.0) + ({selectedSummary.multisportHours.toFixed(2)} × 0.4) + ({selectedSummary.mobilityHours.toFixed(2)} × 0.5) = <strong>{selectedSummary.effectiveTennisScore.toFixed(2)} pts</strong>
                </div>
              </div>
            </div>

            {/* Kid 2 Daily Contribution (when comparing both boys) */}
            {showBothKids && profile2 && selectedK2Summary && (
              <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between font-bold text-cyan-400">
                  <span>🎾 {profile2.name} (+{selectedK2Summary.effectiveTennisScore.toFixed(2)} pts)</span>
                </div>
                <div className="text-slate-300 space-y-0.5 text-[10px]">
                  <div>• Tennis Logged: <strong>{selectedK2Summary.tennisHours.toFixed(2)}h</strong></div>
                  <div>• Multisport: <strong>{selectedK2Summary.multisportHours.toFixed(2)}h</strong></div>
                  <div>• Mobility / Prehab: <strong>{selectedK2Summary.mobilityHours.toFixed(2)}h</strong></div>
                  <div>• Sleep: <strong>{selectedK2Summary.sleepHours.toFixed(2)}h</strong> • School: <strong>{selectedK2Summary.schoolHours.toFixed(2)}h</strong></div>
                  {selectedK2Summary.unnoticedHours > 0 && (
                    <div className="text-red-400">• Unnoticed Dead Time: <strong>{selectedK2Summary.unnoticedHours.toFixed(2)}h</strong></div>
                  )}
                  <div className="text-cyan-300 font-mono pt-1 border-t border-slate-800 text-[9.5px]">
                    Calculation: ({selectedK2Summary.tennisHours.toFixed(2)} × 1.0) + ({selectedK2Summary.multisportHours.toFixed(2)} × 0.4) + ({selectedK2Summary.mobilityHours.toFixed(2)} × 0.5) = <strong>{selectedK2Summary.effectiveTennisScore.toFixed(2)} pts</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Ideal Pro Benchmark Contribution */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-sky-500/30">
              <div className="flex items-center justify-between font-bold text-sky-400">
                <span>⭐ Ideal Pro Benchmark (Target: +{selectedSummary.idealScoreTarget.toFixed(2)} pts)</span>
              </div>
              <div className="text-slate-300 space-y-0.5 text-[10px]">
                <div>• Target Tennis: <strong>{selectedSummary.idealTennisTarget.toFixed(2)}h</strong></div>
                <div>• Target Multisport: <strong>{selectedSummary.idealMultisportTarget.toFixed(2)}h</strong></div>
                <div>• Target Sleep: <strong>{selectedSummary.idealSleepTarget.toFixed(2)}h</strong></div>
                <div className="text-sky-300 font-mono pt-1 border-t border-slate-800 text-[9.5px]">
                  Calculation: ({selectedSummary.idealTennisTarget.toFixed(2)} × 0.8) + ({selectedSummary.idealMultisportTarget.toFixed(2)} × 0.4) + (0.50 × 0.5) = <strong>{selectedSummary.idealScoreTarget.toFixed(2)} pts</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
