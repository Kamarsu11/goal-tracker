import React, { useRef, useState } from 'react';
import './chartConfig';
import { Line } from 'react-chartjs-2';
import { DailySummary, ChildProfile } from '../../types';
import { Maximize2, RotateCcw, TrendingUp, Info, Calendar, Percent } from 'lucide-react';

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
  const [displayMode, setDisplayMode] = useState<'points' | 'normalized'>('points');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(() =>
    k1Summaries.length > 0 ? k1Summaries.length - 1 : 0
  );

  // Build cumulative datasets
  const labels = k1Summaries.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' });
  });

  const todayStr = new Date().toISOString().split('T')[0];

  // Ideal Pro Benchmark accumulates steadily for every day in the period
  let cumIdeal1 = 0;
  const idealData1 = k1Summaries.map(s => {
    cumIdeal1 += s.idealScoreTarget;
    return parseFloat(cumIdeal1.toFixed(2));
  });

  let cumIdeal2 = 0;
  const idealData2 = k2Summaries.map(s => {
    cumIdeal2 += s.idealScoreTarget;
    return parseFloat(cumIdeal2.toFixed(2));
  });

  // Actual kid cumulative scores - plot for all confirmed / sick days (unconfirmed draft days are omitted)
  let cumK1 = 0;
  let hasStartedK1 = false;
  const k1Data = k1Summaries.map(s => {
    if (s.status === 'confirmed' || s.status === 'sick') {
      cumK1 += s.effectiveTennisScore;
      hasStartedK1 = true;
      return parseFloat(cumK1.toFixed(2));
    }
    return null;
  });

  let cumK2 = 0;
  let hasStartedK2 = false;
  const k2Data = k2Summaries.map(s => {
    if (s.status === 'confirmed' || s.status === 'sick') {
      cumK2 += s.effectiveTennisScore;
      hasStartedK2 = true;
      return parseFloat(cumK2.toFixed(2));
    }
    return null;
  });

  // Normalized % datasets (% of Age Milestone Target)
  const normIdeal = k1Summaries.map(() => 100);
  const normK1 = k1Data.map((val, idx) => {
    if (val === null) return null;
    const target = idealData1[idx] || 1;
    return target > 0 ? parseFloat(((val / target) * 100).toFixed(1)) : 100;
  });
  const normK2 = k2Data.map((val, idx) => {
    if (val === null) return null;
    const target = idealData2[idx] || 1;
    return target > 0 ? parseFloat(((val / target) * 100).toFixed(1)) : 100;
  });

  let datasets: any[] = [];

  if (displayMode === 'normalized') {
    datasets = [
      {
        label: '⭐ 100% Age Milestone Benchmark',
        data: normIdeal,
        borderColor: '#38bdf8',
        borderWidth: 2.5,
        borderDash: [6, 4],
        pointRadius: 0,
        fill: false,
      },
      {
        label: `🎾 ${profile1.name} (% of Age ${profile1.age} Target)`,
        data: normK1,
        borderColor: '#ccff00',
        backgroundColor: 'rgba(204, 255, 0, 0.15)',
        borderWidth: 3.5,
        pointRadius: k1Summaries.length > 60 ? 0 : 5,
        pointBackgroundColor: '#ccff00',
        pointHoverRadius: 8,
        fill: false,
        tension: 0.2,
        spanGaps: true,
      },
    ];

    if (showBothKids && profile2 && k2Summaries.length > 0) {
      datasets.push({
        label: `🎾 ${profile2.name} (% of Age ${profile2.age} Target)`,
        data: normK2,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 3,
        pointRadius: k1Summaries.length > 60 ? 0 : 5,
        pointBackgroundColor: '#06b6d4',
        pointHoverRadius: 8,
        fill: false,
        tension: 0.2,
        spanGaps: true,
      });
    }
  } else {
    // Raw points mode
    datasets = [
      {
        label: `⭐ Ideal Pro Benchmark (${profile1.age}yo Target)`,
        data: idealData1,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.08)',
        borderWidth: 3,
        borderDash: [6, 4],
        pointRadius: k1Summaries.length > 60 ? 0 : 4,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.3,
      },
      {
        label: `🎾 ${profile1.name} (Actual Score)`,
        data: k1Data,
        borderColor: '#ccff00',
        backgroundColor: 'rgba(204, 255, 0, 0.15)',
        borderWidth: 3.5,
        pointRadius: k1Summaries.length > 60 ? 0 : 5,
        pointBackgroundColor: '#ccff00',
        pointHoverRadius: 8,
        fill: false,
        tension: 0.2,
        spanGaps: true,
      },
    ];

    if (showBothKids && profile2 && k2Summaries.length > 0) {
      datasets.push({
        label: `⭐ Ideal Pro Benchmark (${profile2.age}yo Target)`,
        data: idealData2,
        borderColor: '#818cf8',
        borderWidth: 2,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      });

      datasets.push({
        label: `🎾 ${profile2.name} (Actual Score)`,
        data: k2Data,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        borderWidth: 3,
        pointRadius: k1Summaries.length > 60 ? 0 : 5,
        pointBackgroundColor: '#06b6d4',
        pointHoverRadius: 8,
        fill: false,
        tension: 0.2,
        spanGaps: true,
      });
    }
  }

  const chartData = { labels, datasets };

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
          padding: 10,
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
              setTimeout(() => setSelectedDayIndex(index), 0);
            }
            return '';
          },
          label: (context: any) => {
            const val = context.raw || 0;
            return displayMode === 'normalized'
              ? ` ${context.dataset.label}: ${val}%`
              : ` ${context.dataset.label}: ${val} pts`;
          },
        },
      },
      zoom: {
        pan: { enabled: true, mode: 'x' },
        zoom: {
          wheel: { enabled: true },
          pinch: { enabled: true },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.3)' },
        ticks: { color: '#94a3b8', font: { size: 10 }, maxTicksLimit: 12 },
      },
      y: {
        title: {
          display: true,
          text: displayMode === 'normalized' ? '% of Age Target' : 'Cumulative Athletic Score',
          color: '#94a3b8',
          font: { size: 11 },
        },
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        ticks: { color: '#94a3b8', font: { size: 10 } },
      },
    },
  };

  const handleResetZoom = () => {
    if (chartRef.current) chartRef.current.resetZoom();
  };

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
      {/* Header with display mode toggle, zoom reset and fullscreen */}
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
              Tap any point on chart to inspect exact daily calculation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Points vs Normalized % Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setDisplayMode('points')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                displayMode === 'points'
                  ? 'bg-tennis-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Points
            </button>
            <button
              onClick={() => setDisplayMode('normalized')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                displayMode === 'normalized'
                  ? 'bg-tennis-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Normalized % of each boy's individual age milestone"
            >
              % Normalized
            </button>
          </div>

          {k1Summaries.length > 30 && (
            <div className="flex items-center gap-1 bg-slate-900 px-1.5 py-0.5 rounded-lg border border-slate-800 text-[10px]">
              <span className="text-slate-400">View:</span>
              <button onClick={() => handleZoomPreset(14)} className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold">14D</button>
              <button onClick={() => handleZoomPreset(30)} className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold">30D</button>
              <button onClick={() => handleZoomPreset(90)} className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold">90D</button>
              <button onClick={() => handleZoomPreset(0)} className="px-1.5 py-0.5 hover:text-tennis-400 text-slate-300 font-semibold">All</button>
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

      {/* Interactive Day Inspector Card */}
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
              <span>{profile1.name}: <strong className="text-tennis-400 font-bold">{k1Data[selectedDayIndex]} pts</strong> ({normK1[selectedDayIndex]}%)</span>
              {showBothKids && profile2 && selectedK2Summary && (
                <span>• {profile2.name}: <strong className="text-cyan-400 font-bold">{k2Data[selectedDayIndex]} pts</strong> ({normK2[selectedDayIndex]}%)</span>
              )}
            </div>
          </div>

          <div className={`grid grid-cols-1 ${showBothKids && profile2 && selectedK2Summary ? 'md:grid-cols-3' : 'sm:grid-cols-2'} gap-3 text-[11px]`}>
            {/* Kid 1 Daily Contribution */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-lime-500/30">
              <div className="flex items-center justify-between font-bold text-tennis-400">
                <span>🎾 {profile1.name} (Day: +{selectedSummary.effectiveTennisScore.toFixed(2)} pts)</span>
              </div>
              <div className="text-slate-300 space-y-0.5 text-[10px]">
                <div>• High-Int Tennis: <strong>{selectedSummary.highIntensityTennisHours.toFixed(2)}h</strong> (1.0x)</div>
                <div>• Practice Matches: <strong>{selectedSummary.practiceMatchHours.toFixed(2)}h</strong> (0.8x)</div>
                <div>• Squad Tennis: <strong>{selectedSummary.squadTennisHours.toFixed(2)}h</strong> (0.6x)</div>
                <div>• Multisport: <strong>{selectedSummary.multisportHours.toFixed(2)}h</strong> (0.7x)</div>
                <div>• S&C Footwork: <strong>{selectedSummary.scFootworkHours.toFixed(2)}h</strong> (0.6x)</div>
                <div>• Pre-hab & Mobility: <strong>{selectedSummary.mobilityHours.toFixed(2)}h</strong> (0.5x)</div>
                <div>• Intentional Rest: <strong>{selectedSummary.intentionalRestHours.toFixed(2)}h</strong> (0.5x)</div>
                <div>• Tennis IQ: <strong>{selectedSummary.tennisIqHours.toFixed(2)}h</strong> (0.5x)</div>
              </div>
            </div>

            {/* Kid 2 Daily Contribution */}
            {showBothKids && profile2 && selectedK2Summary && (
              <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-cyan-500/30">
                <div className="flex items-center justify-between font-bold text-cyan-400">
                  <span>🎾 {profile2.name} (Day: +{selectedK2Summary.effectiveTennisScore.toFixed(2)} pts)</span>
                </div>
                <div className="text-slate-300 space-y-0.5 text-[10px]">
                  <div>• High-Int Tennis: <strong>{selectedK2Summary.highIntensityTennisHours.toFixed(2)}h</strong> (1.0x)</div>
                  <div>• Practice Matches: <strong>{selectedK2Summary.practiceMatchHours.toFixed(2)}h</strong> (0.8x)</div>
                  <div>• Squad Tennis: <strong>{selectedK2Summary.squadTennisHours.toFixed(2)}h</strong> (0.6x)</div>
                  <div>• Multisport: <strong>{selectedK2Summary.multisportHours.toFixed(2)}h</strong> (0.7x)</div>
                  <div>• S&C Footwork: <strong>{selectedK2Summary.scFootworkHours.toFixed(2)}h</strong> (0.6x)</div>
                  <div>• Pre-hab & Mobility: <strong>{selectedK2Summary.mobilityHours.toFixed(2)}h</strong> (0.5x)</div>
                  <div>• Intentional Rest: <strong>{selectedK2Summary.intentionalRestHours.toFixed(2)}h</strong> (0.5x)</div>
                  <div>• Tennis IQ: <strong>{selectedK2Summary.tennisIqHours.toFixed(2)}h</strong> (0.5x)</div>
                </div>
              </div>
            )}

            {/* Ideal Pro Benchmark Contribution */}
            <div className="space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-sky-500/30">
              <div className="flex items-center justify-between font-bold text-sky-400">
                <span>⭐ Ideal Pro Benchmark (+{selectedSummary.idealScoreTarget.toFixed(2)} pts/day)</span>
              </div>
              <div className="text-slate-300 space-y-0.5 text-[10px]">
                <div>• Age {profile1.age} Weekly Target: <strong>{(selectedSummary.idealScoreTarget * 7).toFixed(2)} pts/wk</strong></div>
                <div>• Age {profile1.age} Daily Target Rate: <strong>{selectedSummary.idealScoreTarget.toFixed(2)} pts/day</strong></div>
                <div>• Target Tennis Volume: <strong>{selectedSummary.idealTennisTarget.toFixed(2)}h</strong></div>
                <div>• Target Multisport: <strong>{selectedSummary.idealMultisportTarget.toFixed(2)}h</strong></div>
                <div>• Target Sleep: <strong>{selectedSummary.idealSleepTarget.toFixed(2)}h</strong></div>
                <div className="text-sky-300 font-mono pt-1 border-t border-slate-800 text-[9.5px]">
                  Grounded in European Pro Development Pathway A (Standard Schooling + High-Performance Club)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
