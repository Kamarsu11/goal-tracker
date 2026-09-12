import React, { useRef, useState } from 'react';
import './chartConfig';
import { Line } from 'react-chartjs-2';
import { DailySummary, ChildProfile } from '../../types';
import { X, RotateCcw, ZoomIn } from 'lucide-react';

interface FullscreenChartModalProps {
  isOpen: boolean;
  onClose: () => void;
  k1Summaries: DailySummary[];
  k2Summaries: DailySummary[];
  profile1: ChildProfile;
  profile2?: ChildProfile;
  showBothKids: boolean;
}

export const FullscreenChartModal: React.FC<FullscreenChartModalProps> = ({
  isOpen,
  onClose,
  k1Summaries,
  k2Summaries,
  profile1,
  profile2,
  showBothKids,
}) => {
  const chartRef = useRef<any>(null);
  const [displayMode, setDisplayMode] = useState<'points' | 'normalized'>('points');

  if (!isOpen) return null;

  const labels = k1Summaries.map(s => {
    const d = new Date(s.date + 'T12:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });

  const todayStr = new Date().toISOString().split('T')[0];

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

  let cumK1 = 0;
  const k1Data = k1Summaries.map(s => {
    if (s.date > todayStr || s.status === 'unlogged') {
      return null;
    }
    if (s.status === 'confirmed' || s.status === 'sick') {
      cumK1 += s.effectiveTennisScore;
      return parseFloat(cumK1.toFixed(2));
    }
    return null;
  });

  let cumK2 = 0;
  const k2Data = k2Summaries.map(s => {
    if (s.date > todayStr || s.status === 'unlogged') {
      return null;
    }
    if (s.status === 'confirmed' || s.status === 'sick') {
      cumK2 += s.effectiveTennisScore;
      return parseFloat(cumK2.toFixed(2));
    }
    return null;
  });

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
        borderWidth: 4,
        pointRadius: 5,
        pointBackgroundColor: '#ccff00',
        fill: false,
        tension: 0.2,
      },
    ];

    if (showBothKids && profile2) {
      datasets.push({
        label: `🎾 ${profile2.name} (% of Age ${profile2.age} Target)`,
        data: normK2,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.15)',
        borderWidth: 4,
        pointRadius: 5,
        pointBackgroundColor: '#06b6d4',
        fill: false,
        tension: 0.2,
        spanGaps: true,
      });
    }
  } else {
    datasets = [
      {
        label: `⭐ Ideal Pro Target (${profile1.age}yo Benchmark)`,
        data: idealData1,
        borderColor: '#38bdf8',
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderWidth: 3.5,
        borderDash: [6, 4],
        pointRadius: 3,
        fill: true,
        tension: 0.3,
      },
      {
        label: `🎾 ${profile1.name} (Actual Score)`,
        data: k1Data,
        borderColor: '#ccff00',
        backgroundColor: 'rgba(204, 255, 0, 0.2)',
        borderWidth: 4,
        pointRadius: 5,
        pointBackgroundColor: '#ccff00',
        fill: false,
        tension: 0.2,
        spanGaps: true,
      },
    ];

    if (showBothKids && profile2) {
      datasets.push({
        label: `⭐ Ideal Pro Target (${profile2.age}yo Benchmark)`,
        data: idealData2,
        borderColor: '#818cf8',
        borderWidth: 2.5,
        borderDash: [4, 4],
        pointRadius: 0,
        fill: false,
      });

      datasets.push({
        label: `🎾 ${profile2.name} (Actual Score)`,
        data: k2Data,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.2)',
        borderWidth: 3.5,
        pointRadius: 5,
        pointBackgroundColor: '#06b6d4',
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
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#f8fafc',
          font: { size: 13, weight: 'bold' },
          padding: 16,
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
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 14 },
        bodyFont: { size: 13 },
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        ticks: { color: '#cbd5e1', font: { size: 12 } },
      },
      y: {
        title: {
          display: true,
          text: 'Cumulative Athletic Score',
          color: '#cbd5e1',
          font: { size: 13, weight: 'bold' },
        },
        grid: { color: 'rgba(51, 65, 85, 0.4)' },
        ticks: { color: '#cbd5e1', font: { size: 12 } },
      },
    },
  };

  const handleReset = () => {
    if (chartRef.current) chartRef.current.resetZoom();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col p-4 sm:p-6 animate-fade-in">
      {/* Modal Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-brand-border">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-tennis-500/20 text-tennis-400 rounded-xl">
            <ZoomIn className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-100">
              Fullscreen Performance & Trajectory Analysis
            </h2>
            <p className="text-xs text-slate-400">
              Pinch or Drag horizontally to zoom into specific date intervals
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Points vs Normalized % Mode Toggle */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setDisplayMode('points')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayMode === 'points'
                  ? 'bg-tennis-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Raw Points
            </button>
            <button
              onClick={() => setDisplayMode('normalized')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                displayMode === 'normalized'
                  ? 'bg-tennis-500 text-black font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              % Normalized
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-200 rounded-xl text-xs font-semibold"
          >
            <RotateCcw className="w-4 h-4" /> Reset Zoom
          </button>
          <button
            onClick={onClose}
            className="p-2 bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Fullscreen Canvas */}
      <div className="flex-1 w-full min-h-0 pt-4">
        <Line ref={chartRef} data={chartData} options={chartOptions} />
      </div>

      {/* Bottom hint */}
      <div className="pt-2 text-center text-xs text-slate-500">
        💡 Tip: Double tap or pinch with two fingers on iPhone to zoom in and examine daily inflection points.
      </div>
    </div>
  );
};
